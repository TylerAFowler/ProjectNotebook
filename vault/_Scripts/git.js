// Templater user script: tp.user.git(tp, action, opts)
//   "refresh"     → refreshes the 🧾 Git section of the active project hub (or the project the active note is in),
//                   or the 🧾 Commits section of the active daily note. Returns a status message.
//   "dailyBlock"  → returns the commits block for a daily note ({ date: "YYYY-MM-DD" }); never throws.
//   "forget"      → forgets the stored tokens/usernames on this computer.
//   "activity"    → { since, until } (YYYY-MM-DD) → { md: {projectName: markdown}, errors: [] } for the weekly report:
//                   every commit in the window on every branch (grouped by branch, ★ = yours) + PRs opened/merged.
// Refreshing while on the "Git Activity" page (type: git-activity) shows the last 7 days for all projects.
//
// Repos come from each project hub's `repo` property (one URL or a list):
//   https://github.com/owner/repo                      whole repo
//   https://github.com/owner/repo/tree/main/backend    only commits touching backend/ (shared/mono repos)
//   https://github.example.gov/team/repo               GitHub Enterprise Server (API at /api/v3)
// Optional `repo_path` property also limits commits to a folder.
//
// Tasks link to branches with "🌿 branch-name" in the task text, e.g.
//   - [ ] Add SSO login 🌿 feature/sso-login 📅 2026-12-05
//
// Tokens are stored per host in Obsidian's local storage on THIS computer only (never in a note, never synced).
// Nothing here writes to GitHub: it only reads.
async function git(tp, action, opts = {}) {
  const app = tp.app, m = window.moment;
  const store = {
    get: k => (app.loadLocalStorage ? app.loadLocalStorage(k) : window.localStorage.getItem(k)),
    set: (k, v) => (app.saveLocalStorage ? app.saveLocalStorage(k, v) : (v === null ? window.localStorage.removeItem(k) : window.localStorage.setItem(k, v))),
  };
  const fmOf = f => app.metadataCache.getFileCache(f)?.frontmatter ?? {};
  const asList = v => [].concat(v ?? []).map(x => String(x ?? "").trim()).filter(Boolean);
  const cell = s => String(s ?? "").replace(/\|/g, "\\|");
  const firstLine = s => String(s ?? "").split("\n")[0].trim();
  const enc = s => encodeURIComponent(s).replace(/%2F/gi, "/");
  const START = "<!-- git:start -->", END = "<!-- git:end -->";
  const BLOCK = /<!-- git:start -->[\s\S]*?<!-- git:end -->/;

  // ---------- repo URLs ----------
  const parseRepo = (url, pathOverride) => {
    let u;
    try { u = new URL(url); } catch { throw new Error(`"${url}" isn't a valid repo URL.`); }
    const parts = u.pathname.replace(/\.git$/, "").split("/").filter(Boolean);
    if (parts.length < 2) throw new Error(`"${url}" should look like https://<host>/<owner>/<repo>.`);
    const [owner, repo, kw, ref, ...rest] = parts;
    const host = u.host.toLowerCase();
    const api = host === "github.com" ? "https://api.github.com"
      : host.endsWith(".ghe.com") ? `https://api.${host}`
      : `https://${host}/api/v3`;
    return {
      host, api, owner, repo, web: `https://${host}/${owner}/${repo}`,
      ref: kw === "tree" ? ref : null,
      path: (kw === "tree" && rest.length ? rest.join("/") : (pathOverride || "")).replace(/^\/|\/$/g, ""),
    };
  };

  // ---------- auth (per host, per computer) ----------
  const tokens = new Map();
  const getToken = async host => {
    if (tokens.has(host)) return tokens.get(host);
    let t = store.get(`git-token:${host}`);
    if (t === null || t === undefined) {
      t = (await tp.system.prompt(`Read-only access token for ${host} (stored only on this computer). Leave blank for public repos.`, "")) ?? "";
      t = t.trim();
      store.set(`git-token:${host}`, t);
    }
    tokens.set(host, t);
    return t;
  };
  const getLogin = async r => {
    let login = store.get(`git-login:${r.host}`);
    if (login) return login;
    const token = await getToken(r.host);
    if (token) login = (await call(r, "/user"))?.login;
    if (!login) login = (await tp.system.prompt(`Your username on ${r.host}`, ""))?.trim();
    if (login) store.set(`git-login:${r.host}`, login);
    return login;
  };

  // ---------- API ----------
  const call = async (r, path, query = {}) => {
    const token = await getToken(r.host);
    const qs = Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    const url = `${r.api}${path}${qs ? "?" + qs : ""}`;
    let res;
    try {
      res = await tp.obsidian.requestUrl({
        url, throw: false,
        headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
    } catch (e) { throw new Error(`Couldn't reach ${r.host} (${e.message}). Are you on the network/VPN it needs?`); }
    const msg = res.json?.message ?? "";
    if (res.status === 401) {
      store.set(`git-token:${r.host}`, null); store.set(`git-login:${r.host}`, null);
      throw new Error(`${r.host} rejected the token (401). It's been forgotten; run Refresh Git again to enter a new one.`);
    }
    if (res.status === 404) return null;
    if (res.status === 403 && /SAML|SSO/i.test(msg)) throw new Error(`${r.host}: this organization uses SSO. On GitHub, open the token's settings and "Configure SSO" → Authorize for the org.`);
    if (res.status === 403 || res.status === 429) throw new Error(`${r.host}: access denied or rate-limited (${res.status}). ${msg}`);
    if (res.status >= 400) throw new Error(`${r.host} ${path}: HTTP ${res.status} ${msg}`);
    return res.json;
  };

  // ---------- vault helpers ----------
  const projects = () => app.vault.getMarkdownFiles().filter(f => !f.path.startsWith("_Templates/") && fmOf(f).type === "project");
  const hubFor = f => {
    if (fmOf(f).type === "project") return f;
    return projects().filter(p => f.path.startsWith(p.parent.path + "/"))
      .sort((a, b) => b.parent.path.length - a.parent.path.length)[0] ?? null;
  };
  const reposOf = hub => { const fm = fmOf(hub); return asList(fm.repo).map(u => parseRepo(u, fm.repo_path)); };
  const taskBranches = async hub => {
    const out = [];
    for (const f of app.vault.getMarkdownFiles().filter(f => f.path.startsWith(hub.parent.path + "/"))) {
      for (const line of (await app.vault.cachedRead(f)).split("\n")) {
        const t = line.match(/^\s*[-*+] \[( |\/)\] (.*)$/);
        const b = t && t[2].match(/🌿\s*(\S+)/);
        if (b) out.push({ branch: b[1], text: t[2].replace(/🌿\s*\S+/, "").replace(/🎯\s*(FY\d{4} Q\d|\d{4}-\d{2}-\d{2})/, "").replace(/\s*👤\s*\[\[[^\]]+\]\]/g, "").split(/[📅⏳🛫✅➕❌⏫🔼🔽🔺⏬🔁🆔⛔]/u)[0].trim(), file: f.basename });
      }
    }
    return out;
  };
  const writeBlock = async (file, heading, content) => {
    const block = `${START}\n${content}\n${END}`;
    await app.vault.process(file, d => {
      if (BLOCK.test(d)) return d.replace(BLOCK, () => block);
      const lines = d.split("\n");
      const at = lines.findIndex(l => /^## .*(related knowledge|aware)/i.test(l));
      const sec = [heading, block, ""];
      if (at < 0) return d.replace(/\n*$/, "\n\n") + sec.join("\n") + "\n";
      lines.splice(at, 0, ...sec);
      return lines.join("\n");
    });
  };
  const commitLine = c => `${m(c.commit?.author?.date).format("MM-DD")} [\`${c.sha.slice(0, 7)}\`](${c.html_url}) ${firstLine(c.commit?.message)}`;

  // ---------- project hub section ----------
  const hubBlock = async hub => {
    const repos = reposOf(hub);
    if (!repos.length) return "*No repo yet: add the repo URL(s) to this hub's `repo` property, then run Refresh Git.*";
    const tasks = await taskBranches(hub);
    const found = new Set();
    const out = [`*Refreshed ${m().format("YYYY-MM-DD HH:mm")}*`, ""];
    for (const r of repos) {
      const info = await call(r, `/repos/${r.owner}/${r.repo}`);
      if (!info) { out.push(`**${r.owner}/${r.repo}** on ${r.host}: not found. If it's private, the token needs access to it.`, ""); continue; }
      const base = r.ref || info.default_branch;
      out.push(`### [${r.owner}/${r.repo}](${r.web})${r.path ? ` · \`${r.path}/\`` : ""} · default \`${base}\``, "");
      const pulls = (await call(r, `/repos/${r.owner}/${r.repo}/pulls`, { state: "open", per_page: 100 })) ?? [];
      const prFor = b => pulls.find(p => p.head?.ref === b);
      const prCell = b => { const p = prFor(b); return p ? `[#${p.number}${p.draft ? " (draft)" : ""}](${p.html_url})` : ""; };

      // Task branches
      const rows = [], details = [];
      for (const t of tasks) {
        const cmp = await call(r, `/repos/${r.owner}/${r.repo}/compare/${enc(base)}...${enc(t.branch)}`);
        if (!cmp) continue;
        found.add(t.branch);
        const commits = [...(cmp.commits ?? [])].reverse();
        const last = commits[0];
        rows.push(`| ${cell(t.text)} | [${cell(t.branch)}](${r.web}/tree/${enc(t.branch)}) | ${cmp.ahead_by} ahead · ${cmp.behind_by} behind | ${last ? cell(`${m(last.commit.author.date).format("MM-DD")} ${firstLine(last.commit.message)}`) : "no new commits"} | ${prCell(t.branch)} |`);
        if (commits.length) details.push(`- **${t.text}** (\`${t.branch}\`)`, ...commits.slice(0, 5).map(c => `    - ${commitLine(c)}`), ...(commits.length > 5 ? [`    - … [${commits.length - 5} more](${cmp.html_url})`] : []));
      }
      if (rows.length) {
        out.push("**🌿 Task branches**", "", "| Task | Branch | vs default | Last commit | PR |", "| ---- | ------ | ---------- | ----------- | -- |", ...rows, "");
        if (details.length) out.push("**Commits on task branches** (not yet in default)", ...details, "");
      }

      // Open PRs / other branches
      const otherPrs = pulls.filter(p => !tasks.some(t => t.branch === p.head?.ref));
      if (otherPrs.length) out.push("**Open pull requests**", ...otherPrs.slice(0, 15).map(p => `- [#${p.number}](${p.html_url}) ${p.title} (\`${p.head?.ref}\`, ${p.user?.login ?? ""})`), "");
      if (!r.path) {
        const branches = ((await call(r, `/repos/${r.owner}/${r.repo}/branches`, { per_page: 100 })) ?? [])
          .map(b => b.name).filter(n => n !== base && !tasks.some(t => t.branch === n));
        if (branches.length) out.push(`**Other branches** (${branches.length}): ` + branches.slice(0, 30).map(n => `\`${n}\`${prFor(n) ? ` ${prCell(n)}` : ""}`).join(", ") + (branches.length > 30 ? ", …" : ""), "");
      }

      // Recent commits on the default branch
      const recent = (await call(r, `/repos/${r.owner}/${r.repo}/commits`, { sha: base, path: r.path, per_page: 15 })) ?? [];
      out.push(`**🧾 Recent commits on \`${base}\`**${r.path ? ` touching \`${r.path}/\`` : ""}`,
        ...(recent.length ? recent.map(c => `- ${commitLine(c)}: ${c.author?.login ?? c.commit?.author?.name ?? ""}`) : ["- (none)"]), "");
    }
    const missing = [...new Set(tasks.map(t => t.branch))].filter(b => !found.has(b));
    if (missing.length) out.push(`*Task branches not found on the remote yet:* ${missing.map(b => `\`${b}\``).join(", ")}`, "");
    return out.join("\n").trimEnd();
  };

  // ---------- all branches / commits / PRs in a window (weekly report + Git Activity page) ----------
  const collect = async (hub, since, until) => {
    const res = [];
    const inWin = d => !!d && m(d).isBetween(since, until, undefined, "[]");
    for (const r of reposOf(hub)) {
      try {
        const info = await call(r, `/repos/${r.owner}/${r.repo}`);
        if (!info) { res.push({ r, error: "not found, or the token has no access" }); continue; }
        const base = r.ref || info.default_branch;
        const login = (await getLogin(r))?.toLowerCase();
        const mk = c => {
          const who = c.author?.login ?? c.commit?.author?.name ?? "";
          return { sha: c.sha, url: c.html_url, msg: firstLine(c.commit?.message), date: c.commit?.author?.date, who, mine: !!login && who.toLowerCase() === login };
        };
        const branches = [{ name: base, isDefault: true,
          commits: ((await call(r, `/repos/${r.owner}/${r.repo}/commits`, { sha: base, since: since.toISOString(), until: until.toISOString(), path: r.path, per_page: 100 })) ?? []).map(mk) }];
        const names = ((await call(r, `/repos/${r.owner}/${r.repo}/branches`, { per_page: 100 })) ?? []).map(b => b.name).filter(n => n !== base).slice(0, 60);
        for (const n of names) {
          const cmp = await call(r, `/repos/${r.owner}/${r.repo}/compare/${enc(base)}...${enc(n)}`);
          if (!cmp) continue;
          if (r.path && !(cmp.files ?? []).some(f => f.filename?.startsWith(r.path + "/"))) continue;
          const cs = (cmp.commits ?? []).filter(c => inWin(c.commit?.author?.date)).map(mk).reverse();
          if (cs.length) branches.push({ name: n, commits: cs, ahead: cmp.ahead_by, behind: cmp.behind_by });
        }
        const pulls = (await call(r, `/repos/${r.owner}/${r.repo}/pulls`, { state: "all", sort: "updated", direction: "desc", per_page: 100 })) ?? [];
        const prs = { merged: [], opened: [], byBranch: new Map() };
        for (const p of pulls) {
          if (p.state === "open") prs.byBranch.set(p.head?.ref, p);
          const merged = inWin(p.merged_at), opened = inWin(p.created_at);
          if (!merged && !opened) continue;
          if (r.path && !branches.some(b => b.name === p.head?.ref)) {
            const files = (await call(r, `/repos/${r.owner}/${r.repo}/pulls/${p.number}/files`, { per_page: 100 })) ?? [];
            if (!files.some(f => f.filename?.startsWith(r.path + "/"))) continue;
          }
          const who = p.user?.login ?? "";
          const e = { n: p.number, url: p.html_url, title: p.title, who, mine: !!login && who.toLowerCase() === login, branch: p.head?.ref, draft: p.draft };
          (merged ? prs.merged : prs.opened).push(e);
        }
        res.push({ r, base, branches, prs });
      } catch (e) { res.push({ r, error: e.message }); }
    }
    return res;
  };
  const renderActivity = (results, { showEmpty = false, maxPerBranch = 15 } = {}) => {
    const out = [];
    for (const x of results) {
      const title = `[${x.r.owner}/${x.r.repo}](${x.r.web})${x.r.path ? ` · \`${x.r.path}/\`` : ""}`;
      if (x.error) { out.push(`- ⚠️ ${title}: ${x.error}`); continue; }
      const active = x.branches.filter(b => b.commits.length);
      const total = active.reduce((n, b) => n + b.commits.length, 0);
      if (!total && !x.prs.merged.length && !x.prs.opened.length) { if (showEmpty) out.push(`- ${title}: no activity`); continue; }
      out.push(`- ${title}: ${total} commit${total === 1 ? "" : "s"}`);
      for (const b of active) {
        const pr = x.prs.byBranch.get(b.name);
        out.push(`    - \`${b.name}\`${b.isDefault ? " (default)" : ` (${b.ahead} ahead · ${b.behind} behind)`} · ${b.commits.length}${pr ? ` · PR [#${pr.number}](${pr.html_url})${pr.draft ? " draft" : ""}` : ""}`);
        for (const c of b.commits.slice(0, maxPerBranch))
          out.push(`        - ${c.mine ? "★ " : ""}${m(c.date).format("ddd MM-DD")} [\`${c.sha.slice(0, 7)}\`](${c.url}) ${c.msg} (${c.who})`);
        if (b.commits.length > maxPerBranch) out.push(`        - … ${b.commits.length - maxPerBranch} more`);
      }
      const prLine = (label, e) => `    - ${label} [#${e.n}](${e.url}) ${e.title} (${e.mine ? "★ " : ""}${e.who}${e.branch ? `, \`${e.branch}\`` : ""})`;
      out.push(...x.prs.merged.map(e => prLine("✅ Merged PR", e)), ...x.prs.opened.map(e => prLine("🆕 Opened PR", e)));
    }
    return out.join("\n");
  };
  const reposHubs = () => projects().filter(p => asList(fmOf(p).repo).length).sort((a, b) => a.path.localeCompare(b.path));

  // ---------- daily note section ----------
  const dailyBlock = async dateStr => {
    const day = m(dateStr, "YYYY-MM-DD");
    if (!day.isValid()) return "*Daily note title isn't a YYYY-MM-DD date.*";
    const since = day.clone().startOf("day").toISOString(), until = day.clone().endOf("day").toISOString();
    const lines = [], errors = [];
    const hubs = projects().filter(p => asList(fmOf(p).repo).length);
    if (!hubs.length) return "*No project has a `repo` yet.*";
    for (const hub of hubs) {
      const seen = new Set(), mine = [];
      try {
        const branchesOfTasks = (await taskBranches(hub)).map(t => t.branch);
        for (const r of reposOf(hub)) {
          const login = await getLogin(r);
          if (!login) throw new Error(`no username for ${r.host}`);
          const info = await call(r, `/repos/${r.owner}/${r.repo}`);
          if (!info) { errors.push(`${r.owner}/${r.repo}: not found / no access`); continue; }
          const pulls = (await call(r, `/repos/${r.owner}/${r.repo}/pulls`, { state: "open", per_page: 100 })) ?? [];
          const branches = [...new Set([r.ref || info.default_branch, ...branchesOfTasks, ...pulls.filter(p => p.user?.login === login).map(p => p.head?.ref)])].filter(Boolean);
          for (const b of branches) {
            const commits = (await call(r, `/repos/${r.owner}/${r.repo}/commits`, { sha: b, author: login, since, until, path: r.path, per_page: 100 })) ?? [];
            for (const c of commits) if (!seen.has(c.sha)) { seen.add(c.sha); mine.push({ c, b }); }
          }
        }
      } catch (e) { errors.push(`${hub.basename}: ${e.message}`); }
      mine.sort((a, b) => a.c.commit.author.date.localeCompare(b.c.commit.author.date));
      for (const { c, b } of mine) lines.push(`- [[${hub.basename}]] [\`${c.sha.slice(0, 7)}\`](${c.html_url}) ${firstLine(c.commit.message)} (\`${b}\`)`);
    }
    return [
      `*Your commits on ${day.format("YYYY-MM-DD")} · refreshed ${m().format("HH:mm")} · Ctrl+P → Refresh Git to update*`,
      ...(lines.length ? lines : ["- (none yet)"]),
      ...errors.map(e => `- ⚠️ ${e}`),
    ].join("\n");
  };

  // ---------- actions ----------
  if (action === "forget") {
    const hosts = new Set(projects().flatMap(p => { try { return reposOf(p).map(r => r.host); } catch { return []; } }));
    const extra = (await tp.system.prompt("Also forget for these hosts (comma-separated, optional)", "")) || "";
    extra.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).forEach(h => hosts.add(h));
    for (const h of hosts) { store.set(`git-token:${h}`, null); store.set(`git-login:${h}`, null); }
    return `Forgot tokens/usernames for: ${[...hosts].join(", ") || "(no hosts found)"}`;
  }
  if (action === "dailyBlock") {
    try { return `${START}\n${await dailyBlock(opts.date)}\n${END}`; }
    catch (e) { return `${START}\n- ⚠️ ${e.message}\n${END}`; }
  }
  if (action === "activity") {
    const since = m(opts.since, "YYYY-MM-DD").startOf("day"), until = m(opts.until, "YYYY-MM-DD").endOf("day");
    const md = {}, errors = [];
    for (const hub of reposHubs()) {
      try { const txt = renderActivity(await collect(hub, since, until)); if (txt) md[hub.basename] = txt; }
      catch (e) { errors.push(`${hub.basename}: ${e.message}`); }
    }
    return { md, errors };
  }
  if (action === "refresh") {
    const act = tp.config.active_file;
    if (act && fmOf(act).type === "git-activity") {
      const until = m().endOf("day"), since = m().subtract(6, "days").startOf("day");
      const parts = [`*${since.format("ddd MMM D")} – ${until.format("ddd MMM D")} · refreshed ${m().format("YYYY-MM-DD HH:mm")} · ★ = yours*`, ""];
      const hubs = reposHubs();
      if (!hubs.length) parts.push("*No project has a `repo` yet.*");
      for (const hub of hubs) parts.push(`### [[${hub.basename}]]`, renderActivity(await collect(hub, since, until), { showEmpty: true }) || "- no repos", "");
      await writeBlock(act, "## Activity", parts.join("\n").trimEnd());
      return "Updated Git Activity (last 7 days)";
    }
    if (act && fmOf(act).type === "daily") {
      await writeBlock(act, "## 🧾 Commits", await dailyBlock(act.basename));
      return `Updated commits for ${act.basename}`;
    }
    let hub = act ? hubFor(act) : null;
    if (!hub) hub = await tp.user.pickProject(tp);
    await writeBlock(hub, "## 🧾 Git", await hubBlock(hub));
    return `Updated Git section on ${hub.basename}`;
  }
  throw new Error(`Unknown git action "${action}"`);
}
module.exports = git;
