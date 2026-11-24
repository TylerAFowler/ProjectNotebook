// A fake GitHub REST API backed by a local git repository, so the templates' Git features can be
// tested (and the showcase pre-filled) without network access. Only the endpoints git.js uses.
const { execFileSync } = require("child_process");
module.exports = function fakeGitHub({ repoDir, owner, repo, me, logins, host = "github.com" }) {
  const g = (...a) => execFileSync("git", a, { cwd: repoDir, encoding: "utf8", maxBuffer: 1 << 26 }).trim();
  const web = `https://${host}/${owner}/${repo}`;
  const loginOf = email => logins[email] ?? null;
  const emailOf = login => Object.keys(logins).find(e => logins[e] === login);
  const SEP = "\x1f";
  const log = (...args) => {
    const out = g("log", `--format=%H${SEP}%an${SEP}%ae${SEP}%aI${SEP}%B%x1e`, ...args);
    return out.split("\x1e").map(s => s.trim()).filter(Boolean).map(s => {
      const [sha, name, email, date, msg] = s.split(SEP);
      const login = loginOf(email);
      return { sha, html_url: `${web}/commit/${sha}`, commit: { message: msg.trim(), author: { name, email, date } }, author: login ? { login } : null };
    });
  };
  const branches = () => g("for-each-ref", "--format=%(refname:short)", "refs/heads").split("\n").filter(Boolean);
  return async ({ url }) => {
    const u = new URL(url), q = Object.fromEntries(u.searchParams);
    const ok = json => ({ status: 200, json });
    const base = host === "github.com" ? `/repos/${owner}/${repo}` : `/api/v3/repos/${owner}/${repo}`;
    let p = u.pathname;
    if (p === "/user" || p === "/api/v3/user") return ok({ login: me });
    if (!p.startsWith(base)) return { status: 404, json: { message: "Not Found" } };
    p = p.slice(base.length);
    if (p === "") return ok({ default_branch: "main" });
    if (p === "/branches") return ok(branches().map(name => ({ name })));
    if (p === "/pulls") return ok([]);   // the demo repo has no pull requests until you open some
    if (p.startsWith("/compare/")) {
      const [b, h] = decodeURIComponent(p.slice(9)).split("...");
      if (!branches().includes(h)) return { status: 404, json: { message: "Not Found" } };
      const ahead = +g("rev-list", "--count", `${b}..${h}`), behind = +g("rev-list", "--count", `${h}..${b}`);
      const files = g("diff", "--name-only", `${b}...${h}`).split("\n").filter(Boolean).map(filename => ({ filename }));
      return ok({ ahead_by: ahead, behind_by: behind, html_url: `${web}/compare/${b}...${h}`, files, commits: log("--reverse", `${b}..${h}`) });
    }
    if (p === "/commits") {
      const args = [q.sha || "main", `-n${q.per_page || 30}`];
      if (q.since) args.push(`--since=${q.since}`);
      if (q.until) args.push(`--until=${q.until}`);
      if (q.author) args.push(`--author=${emailOf(q.author) ?? q.author}`);
      if (q.path) args.push("--", q.path);
      return ok(log(...args));
    }
    return { status: 404, json: { message: "Not Found" } };
  };
};
