const { run, app } = require("./harness");
const fs = require("fs"), path = require("path");
const V = process.argv[2];
const calls = [];
const C = (sha, msg, date, login = "tboone", repo = "acme/crashdb", host = "github.com") =>
  ({ sha, html_url: `https://${host}/${repo}/commit/${sha}`, commit: { message: msg, author: { name: login, date } }, author: { login } });
global.__fetch = async ({ url, headers }) => {
  calls.push({ url, auth: headers.Authorization });
  const u = new URL(url), p = u.pathname, q = Object.fromEntries(u.searchParams);
  const ok = json => ({ status: 200, json });
  if (headers.Authorization === "Bearer bad") return { status: 401, json: { message: "Bad credentials" } };
  if (u.host === "api.github.com") {
    if (p === "/user") return ok({ login: "tboone" });
    if (p === "/repos/acme/crashdb") return ok({ default_branch: "main" });
    if (p === "/repos/acme/crashdb/pulls" && q.state === "all") return ok([
      { number: 42, state: "open", created_at: "2026-11-23T12:00:00Z", merged_at: null, html_url: "https://github.com/acme/crashdb/pull/42", head: { ref: "feature/sso-login" }, user: { login: "tboone" }, title: "SSO login", draft: true },
      { number: 40, state: "closed", created_at: "2026-11-10T12:00:00Z", merged_at: "2026-11-24T09:00:00Z", html_url: "https://github.com/acme/crashdb/pull/40", head: { ref: "fix/county-codes" }, user: { login: "jdoe" }, title: "County code mapping" },
      { number: 30, state: "closed", created_at: "2026-10-01T12:00:00Z", merged_at: "2026-10-02T09:00:00Z", html_url: "https://github.com/acme/crashdb/pull/30", head: { ref: "old" }, user: { login: "jdoe" }, title: "Old PR" }]);
    if (p === "/repos/acme/crashdb/pulls") return ok([
      { number: 42, html_url: "https://github.com/acme/crashdb/pull/42", head: { ref: "feature/sso-login" }, user: { login: "tboone" }, title: "SSO login", draft: true },
      { number: 43, html_url: "https://github.com/acme/crashdb/pull/43", head: { ref: "fix/typo" }, user: { login: "other" }, title: "Fix typo | readme" }]);
    if (p === "/repos/acme/crashdb/compare/main...feature/sso-login") return ok({ ahead_by: 2, behind_by: 1, html_url: "https://github.com/acme/crashdb/compare/main...feature/sso-login",
      commits: [C("aaaaaaa1", "Add SAML config", "2026-11-23T14:00:00Z"), C("bbbbbbb2", "Wire SAML callback\n\nlong body", "2026-11-24T15:00:00Z")] });
    if (p === "/repos/acme/crashdb/compare/main...fix/typo") return ok({ ahead_by: 1, behind_by: 0, files: [{ filename: "README.md" }], commits: [C("fffffff6", "Fix typo in readme", "2026-11-25T08:00:00Z", "other")] });
    if (p === "/repos/acme/crashdb/compare/main...old/experiment") return ok({ ahead_by: 3, behind_by: 40, files: [{ filename: "x.sql" }], commits: [C("9999999a", "Old experiment", "2026-09-01T08:00:00Z", "tboone")] });
    if (p.startsWith("/repos/acme/crashdb/compare/")) return { status: 404, json: { message: "Not Found" } };
    if (p === "/repos/acme/crashdb/branches") return ok([{ name: "main" }, { name: "feature/sso-login" }, { name: "fix/typo" }, { name: "old/experiment" }]);
    if (p === "/repos/acme/crashdb/commits") {
      if (q.author) return ok(q.sha === "feature/sso-login" ? [C("bbbbbbb2", "Wire SAML callback", "2026-11-24T15:00:00Z")]
                            : q.sha === "main" ? [C("ccccccc3", "Fix county code mapping", "2026-11-24T10:00:00Z"), C("bbbbbbb2", "Wire SAML callback", "2026-11-24T15:00:00Z")] : []);
      const all = [C("ccccccc3", "Fix county code mapping", "2026-11-24T10:00:00Z"), C("ddddddd4", "Initial schema", "2026-11-20T09:00:00Z", "jdoe")];
      return ok(all.filter(c => (!q.since || c.commit.author.date >= q.since) && (!q.until || c.commit.author.date <= q.until)));
    }
  }
  if (u.host === "github.example.gov") {
    if (p === "/api/v3/user") return ok({ login: "tboone" });
    if (p === "/api/v3/repos/team/dashcam") return ok({ default_branch: "main" });
    if (p === "/api/v3/repos/team/dashcam/pulls") return ok([]);
    if (p === "/api/v3/repos/team/dashcam/commits") return ok(q.path === "backend" ? [C("eeeeeee5", "Backend: retry uploads", "2026-11-24T11:00:00Z", "tboone", "team/dashcam", "github.example.gov")] : []);
  }
  return { status: 404, json: { message: "Not Found" } };
};
const edit = (rel, fn) => fs.writeFileSync(path.join(V, rel), fn(fs.readFileSync(path.join(V, rel), "utf8")));
const P = "Crash Database/Example Project/Example Project.md";
(async () => {
  edit(P, s => s.replace("repo: []", "repo:\n  - https://github.com/acme/crashdb"));
  await run("Quick Capture", ["task", (_p, l, v) => v[0], "Add SSO login", "", "2026-12-05", "FY2027 q2", "", "feature/sso-login", ""], { target: "scratch.md", active: P });
  await run("Quick Capture", ["task", (_p, l, v) => v[0], "Spike: new export format", "", "", "", "", "spike/export-v2", ""], { target: "scratch.md", active: P });
  await run("Refresh Git", ["tok-gh"], { target: "scratch.md", active: P });
  console.log("---- HUB GIT SECTION ----");
  const hub = fs.readFileSync(path.join(V, P), "utf8"); console.log(hub.slice(hub.indexOf("## 🧾 Git"), hub.indexOf("<!-- git:end -->") + 16));
  // Enterprise project with folder URL
  await run("New Project", ["Crash Database", "__done__", "Dashcam Backend", false]);
  edit("Crash Database/Dashcam Backend/Dashcam Backend.md", s => s.replace("repo: []", "repo:\n  - https://github.example.gov/team/dashcam/tree/main/backend"));
  await run("Refresh Git", ["tok-ghe"], { target: "scratch.md", active: "Crash Database/Dashcam Backend/Dashcam Backend.md" });
  const h2 = fs.readFileSync(path.join(V, "Crash Database/Dashcam Backend/Dashcam Backend.md"), "utf8");
  console.log("---- GHE ----"); console.log(h2.slice(h2.indexOf("<!-- git:start -->"), h2.indexOf("<!-- git:end -->")));
  // Daily
  await run("Refresh Git", [], { target: "scratch.md", active: "Daily/2026-11-24.md" });
  const d = fs.readFileSync(path.join(V, "Daily/2026-11-24.md"), "utf8");
  console.log("---- DAILY ----"); console.log(d.slice(d.indexOf("## 🧾 Commits"), d.indexOf("<!-- git:end -->") + 16));
  console.log("auth headers used:", [...new Set(calls.map(c => new URL(c.url).host + " " + c.auth))]);
  // Weekly review + Git Activity page
  await run("Weekly Report", [0]);
  const wk = fs.readdirSync(path.join(V, "Weekly")).filter(f => f.includes("(")).pop() || fs.readdirSync(path.join(V, "Weekly")).pop();
  console.log("---- WEEKLY ----"); console.log(fs.readFileSync(path.join(V, "Weekly", wk), "utf8"));
  await run("Refresh Git", [], { target: "scratch.md", active: "Git Activity.md" });
  const ga = fs.readFileSync(path.join(V, "Git Activity.md"), "utf8");
  console.log("---- GIT ACTIVITY ----"); console.log(ga.slice(ga.indexOf("<!-- git:start -->")));
  // bad token
  app.saveLocalStorage("git-token:github.com", "bad");
  await run("Refresh Git", [], { target: "scratch.md", active: P }).catch(e => console.log("EXPECTED 401:", e.message.split("\n")[1]));
  console.log("token after 401:", app.loadLocalStorage("git-token:github.com"));
  console.log("scratch tail:", fs.readFileSync(path.join(V, "scratch.md"), "utf8").split("\n").filter(l => l.includes("[!error]") || l.includes("**")).slice(0, 2));
})().catch(e => { console.error("FAIL", e); process.exit(1); });
