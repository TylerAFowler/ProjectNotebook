// Runs every test against a fresh copy of ../vault. Usage: npm test   (needs git + python3 for the showcase)
const fs = require("fs"), os = require("os"), path = require("path"), { execFileSync } = require("child_process");
const VAULT = path.resolve(__dirname, "../vault");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vault-tests-"));
const fresh = name => {
  const dst = path.join(tmp, name);
  fs.cpSync(VAULT, dst, { recursive: true, filter: s => path.basename(s) !== ".gitkeep" });
  return dst;
};
const node = (script, ...args) => execFileSync(process.execPath, [path.join(__dirname, script), ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
let failed = 0;
const test = (name, fn) => {
  try { const out = fn(); console.log(`✔ ${name} (${(out.match(/✔/g) || []).length} template runs)`); }
  catch (e) { failed++; console.log(`✘ ${name}\n${e.stdout || ""}${e.stderr || e.message}`); }
};
test("scenario: projects, meetings, requirements, issues, quick capture, weekly review", () => node("scenario.js", fresh("scenario")));
test("git: hub, enterprise path, daily note, weekly review, Git Activity, bad token", () => {
  const dir = fresh("git"); node("scenario.js", dir);   // the git test builds on the scenario's notes
  const out = node("gittest.js", dir);
  if (!/EXPECTED 401/.test(out)) throw new Error("401 handling not exercised\n" + out);
  return out;
});
test("multi-category projects and category hubs", () => node("multicat.js", fresh("multicat")));
test("showcase vault (demo repo + every template)", () => {
  const demo = path.join(tmp, "demo"); fs.mkdirSync(demo);
  execFileSync("python3", [path.resolve(__dirname, "../tools/make-demo-code.py"), demo], { stdio: "ignore" });
  const out = node("showcase.js", fresh("showcase"), path.join(demo, "ObsidianNotesDemo"));
  if (!out.includes("SHOWCASE OK")) throw new Error(out);
  return out;
});
fs.rmSync(tmp, { recursive: true, force: true });
console.log(failed ? `\n${failed} test(s) failed` : "\nAll tests passed");
process.exit(failed ? 1 : 0);
