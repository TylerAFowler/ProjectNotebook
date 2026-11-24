// Templater user script: tp.user.weeklyReport(tp, "YYYY-MM-DD", "YYYY-MM-DD")
// Builds a REVIEW page of everything that might be worth putting in the division's weekly report,
// grouped by project:
//   - tasks completed (✅ date in range)       → "… — Completed 11/23"
//   - tasks in progress ([/])                  → "… — Estimated Completion FY2027 Q2" (🎯, else 📅/⏳)
//   - issues found / fixed (issue notes' `found` / `fixed` dates)
//   - requirements added / changed (from each requirement's Version history table)
//   - meetings held, decisions logged ("- YYYY-MM-DD — …" under a Decisions heading)
//   - commits on every branch + pull requests opened/merged (from GitHub; ★ = yours)
//   - daily-note "## Log" bullets
//   - 📣 Let people know: per person (👤 on tasks, `notify` on issues), what got done/fixed for them
//   - coming up next week: tasks due / estimated, scheduled meetings, waiting-on follow-ups

// State fiscal year: starts in July and is named for the year it ends (Jul 2026–Jun 2027 = FY2027).
const FY_START_MONTH = 7;

async function weeklyReport(tp, startStr, endStr) {
  const app = tp.app;
  const m = window.moment;
  const start = m(startStr, "YYYY-MM-DD"), end = m(endStr, "YYYY-MM-DD");
  const nextStart = end.clone().add(1, "day"), nextEnd = end.clone().add(7, "days");
  const DATE = /\d{4}-\d{2}-\d{2}/;

  const toDay = v => {
    if (!v) return null;
    if (v instanceof Date) return m(v);
    const s = String(v).match(DATE);
    return s ? m(s[0], "YYYY-MM-DD") : null;
  };
  const between = (v, a, b) => { const d = toDay(v); return !!d && d.isBetween(a, b, "day", "[]"); };
  const inRange = v => between(v, start, end);
  const inNext = v => between(v, nextStart, nextEnd);
  const fyq = d => {
    const mo = d.month() + 1;
    const fy = FY_START_MONTH === 1 ? d.year() : (mo >= FY_START_MONTH ? d.year() + 1 : d.year());
    const q = Math.floor(((mo - FY_START_MONTH + 12) % 12) / 3) + 1;
    return `FY${fy} Q${q}`;
  };
  const fm = f => app.metadataCache.getFileCache(f)?.frontmatter ?? {};
  const names = v => [].concat(v ?? []).map(x => String(x).replace(/^\[\[|\]\]$/g, "").split("|")[0]);

  // Parse a Tasks-plugin task body into readable text + dates.
  const parseTask = body => {
    const get = re => (body.match(re) || [])[1] ?? null;
    const est = get(/🎯\s*(FY\d{4} Q\d|\d{4}-\d{2}-\d{2})/);
    const branch = get(/🌿\s*(\S+)/);
    const people = [...body.matchAll(/👤\s*\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)].map(x => x[1].trim());
    let text = body.replace(/\s*👤\s*\[\[[^\]]+\]\]/g, "").replace(/🎯\s*(FY\d{4} Q\d|\d{4}-\d{2}-\d{2})/, "").replace(/🌿\s*\S+/, "")
      .split(/[📅⏳🛫✅➕❌⏫🔼🔽🔺⏬🔁🆔⛔]/u)[0].trim()
      .replace(/(^|\s)#request\b\s*/, "$1Request: ").replace(/(^|\s)#waiting\b\s*/, "$1Waiting on: ").trim();
    if (people.length) text += ` (for ${people.join(", ")})`;
    if (branch) text += ` (\`${branch}\`)`;
    return { text, people, est, due: get(/📅\s*(\d{4}-\d{2}-\d{2})/), sched: get(/⏳\s*(\d{4}-\d{2}-\d{2})/), done: get(/✅\s*(\d{4}-\d{2}-\d{2})/), waiting: /#waiting\b/.test(body) };
  };
  const estimate = t => {
    if (t.est && /^FY/.test(t.est)) return t.est;
    const d = toDay(t.est ?? t.due ?? t.sched);
    return d ? fyq(d) : null;
  };
  const withEst = t => { const e = estimate(t); return e ? `${t.text} — Estimated Completion ${e}` : t.text; };

  const SKIP = ["_Templates/", "_Scripts/", "Weekly/"];
  const files = app.vault.getMarkdownFiles().filter(f => !SKIP.some(s => f.path.startsWith(s)));
  const projects = files.filter(f => fm(f).type === "project");
  const byName = new Map(projects.map(p => [p.basename, p]));
  const projectOf = f => projects
    .filter(p => f.path.startsWith(p.parent.path + "/"))
    .sort((a, b) => b.parent.path.length - a.parent.path.length)[0]?.basename ?? null;

  const notifyMap = new Map();   // person → [items done/fixed for them this week]
  const tell = (who, item) => { for (const p of who) { if (!notifyMap.has(p)) notifyMap.set(p, []); notifyMap.get(p).push(item); } };
  const buckets = new Map();
  const bucket = key => {
    key = key ?? "Other";
    if (!buckets.has(key)) buckets.set(key, { done: [], progress: [], issuesNew: [], issuesFixed: [], meetings: [], decisions: [], reqs: [], git: "", log: [], next: [] });
    return buckets.get(key);
  };

  for (const f of files) {
    const meta = fm(f);
    const proj = projectOf(f);
    const isDaily = f.path.startsWith("Daily/");
    const text = await app.vault.cachedRead(f);
    let heading = "";

    for (const line of text.split(/\r?\n/)) {
      const h = line.match(/^#{1,6}\s+(.*)/);
      if (h) { heading = h[1]; continue; }

      const task = line.match(/^\s*[-*+] \[(.)\] (.*)$/);
      if (task) {
        const [, status, body] = task;
        const linked = names((body.match(/\[\[[^\]]+\]\]/) || [])[0]).find(n => byName.has(n));
        const key = proj ?? linked;
        const t = parseTask(body);
        if ((status === "x" || status === "X") && t.done && inRange(t.done)) {
          bucket(key).done.push(`${t.text} — Completed ${toDay(t.done).format("M/D")}`);
          tell(t.people, `✅ ${t.text.replace(/ \(for [^)]*\)/, "")} — Completed ${toDay(t.done).format("M/D")}${key ? ` ([[${key}]])` : ""}`);
        } else if (status === " " || status === "/") {
          if (status === "/") bucket(key).progress.push(withEst(t));
          if (t.waiting && inNext(t.due)) bucket(key).next.push(`⏳ Follow up ${toDay(t.due).format("ddd M/D")}: ${t.text.replace(/^Waiting on: /, "")}`);
          else if (!t.waiting && (inNext(t.due) || inNext(t.est))) bucket(key).next.push(`📅 ${withEst(t)}${t.due && inNext(t.due) ? ` (due ${toDay(t.due).format("ddd M/D")})` : ""}`);
        }
        continue;
      }

      if (meta.type === "requirement" && /version history/i.test(heading) && /^\|\s*v\d+/.test(line)) {
        const c = line.split(/(?<!\\)\|/).slice(1, -1).map(x => x.trim().replace(/\\\|/g, "|"));
        const [ver, date, change, why, meeting] = c;
        if (inRange(date)) {
          const label = `[[${f.basename}|${meta.req_id ?? f.basename}]]`;
          bucket(proj).reqs.push(ver === "v1"
            ? `🆕 ${label} added (${meta.priority ?? "?"}) ${toDay(date).format("M/D")}${meeting ? ` in ${meeting}` : ""}`
            : `✏️ ${label} ${ver} ${toDay(date).format("M/D")}: ${change.length > 160 ? change.slice(0, 160) + "…" : change}${why ? ` (why: ${why})` : ""}${meeting ? ` in ${meeting}` : ""}`);
        }
        continue;
      }

      if (/decision/i.test(heading)) {
        const d = line.match(/^\s*[-*] (\d{4}-\d{2}-\d{2})\s*[—–-]+\s*(.*)$/);
        if (d && inRange(d[1])) bucket(proj).decisions.push(`${toDay(d[1]).format("M/D")} — ${d[2]}`);
        continue;
      }

      if (isDaily && /^log/i.test(heading) && inRange(f.basename)) {
        const b = line.match(/^\s*[-*] (?!\[.\] )(.+)$/);
        if (b && b[1].trim()) {
          const linked = names(b[1].match(/\[\[[^\]]+\]\]/g) || []).find(n => byName.has(n));
          let entry = b[1].trim();
          if (linked) entry = entry.replace(new RegExp(`^\\[\\[${linked.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\|[^\\]]*)?\\]\\]\\s*[:—–-]?\\s*`), "");
          bucket(linked).log.push(`${m(f.basename, "YYYY-MM-DD").format("ddd")}: ${entry}`);
        }
      }
    }

    if (meta.type === "issue") {
      if (inRange(meta.found)) bucket(proj).issuesNew.push(`[[${f.basename}]] (${meta.severity ?? "?"})`);
      const notify = names(meta.notify).filter(Boolean);
      if (inRange(meta.fixed)) {
        bucket(proj).issuesFixed.push(`[[${f.basename}]] — Fixed ${toDay(meta.fixed).format("M/D")}${notify.length ? ` (notify ${notify.join(", ")})` : ""}`);
        tell(notify, `🔧 [[${f.basename}]] — Fixed ${toDay(meta.fixed).format("M/D")}${proj ? ` ([[${proj}]])` : ""}`);
      }
    }
    if (meta.type === "meeting") {
      const who = names(meta.attendees);
      const line = `${toDay(meta.date)?.format("ddd M/D")}${meta.time ? ` ${meta.time}` : ""} [[${f.basename}]]${who.length ? ` (${who.join(", ")})` : ""}`;
      if (inRange(meta.date)) bucket(proj).meetings.push(line);
      else if (inNext(meta.date)) bucket(proj).next.push(`🗓️ ${line}`);
    }
  }

  // Git: commits on every branch + PRs (never let a GitHub problem break the report).
  let gitErrors = [];
  try {
    const { md, errors } = await tp.user.git(tp, "activity", { since: startStr, until: endStr });
    for (const [proj, txt] of Object.entries(md)) bucket(proj).git = txt;
    gitErrors = errors;
  } catch (e) { gitErrors = [e.message]; }

  // ---- Render ----
  const sum = k => [...buckets.values()].reduce((n, b) => n + b[k].length, 0);
  const n = (c, word) => `${c} ${word}${c === 1 ? "" : "s"}`;
  const out = [];
  out.push(`# Weekly review: ${start.format("MMM D")} – ${end.format("MMM D, YYYY")}`, "");
  out.push("> Everything that might be worth putting in the division report. Pick what matters and copy it over.", ">",
    `> ${n(sum("done"), "task")} completed · ${n(sum("progress"), "task")} in progress · ${n(sum("issuesNew"), "issue")} found / ${sum("issuesFixed")} fixed · ` +
    `${n(sum("reqs"), "requirement change")} · ${n(sum("meetings"), "meeting")} · ${n(sum("decisions"), "decision")} · ${n([...buckets.values()].filter(b => b.git).length, "project")} with Git activity`, "");

  if (notifyMap.size) {
    out.push("## 📣 Let people know", "*Done or fixed this week for people waiting on it.*", "");
    for (const [who, items] of [...notifyMap.entries()].sort((a, b) => a[0].localeCompare(b[0])))
      out.push(`**[[${who}]]**`, ...items.map(i => `- ${i}`), "");
  }

  const section = (title, items) => { if (items.length) out.push(`**${title}**`, ...items.map(i => `- ${i}`), ""); };
  const order = [...buckets.keys()].sort((a, b) => (a === "Other") - (b === "Other") || a.localeCompare(b));
  for (const key of order) {
    const b = buckets.get(key);
    const p = byName.get(key);
    out.push(p ? `## ${p.parent.parent?.name ?? ""} / [[${key}]]` : `## ${key}`, "");
    section("✅ Completed", b.done);
    section("🔄 In progress", b.progress);
    section("🐞 Issues found", b.issuesNew);
    section("🔧 Issues fixed", b.issuesFixed);
    section("📐 Requirements added / changed", b.reqs);
    section("🗓️ Meetings", b.meetings);
    section("✅ Decisions", b.decisions);
    if (b.git) out.push("**🧾 Commits & pull requests** (★ = yours)", b.git, "");
    section("📝 Work log", b.log);
    section(`⏭️ Coming up (${nextStart.format("M/D")}–${nextEnd.format("M/D")})`, b.next);
  }
  if (!buckets.size) out.push("_Nothing recorded for this week._");
  if (gitErrors.length) out.push("", "**⚠️ GitHub**", ...gitErrors.map(e => `- ${e}`));
  return out.join("\n");
}
module.exports = weeklyReport;
