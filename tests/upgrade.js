// Upgrade Vault repairs notes made by older template versions, and is safe to run twice.
const { run } = require("./harness");
const fs = require("fs"), path = require("path");
const V = process.argv[2];
const OLD = "*Add repo URL(s) to the `repo` property (use a /tree/<branch>/<folder> URL to limit to a folder), then";
(async () => {
  await run("New Project", ["__new__", "Area", "__done__", "Old Hub", false]);
  const hub = path.join(V, "Area/Old Hub/Old Hub.md");
  let s = fs.readFileSync(hub, "utf8");
  if (/<branch>|<folder>/.test(s)) throw new Error("new hubs must not contain bare <branch>/<folder>");
  if ((s.match(/```actions/g) || []).length !== 1) throw new Error("new hubs should have one row of buttons");
  fs.writeFileSync(hub, s.replace(/\*Add repo URL\(s\).*then/, OLD).replace(/```actions\n.*\n```\n/, ""));   // simulate an old hub
  fs.writeFileSync(path.join(V, "_Templates/keep.md"), OLD);                   // templates must be left alone
  await run("Upgrade Vault", [], { target: "scratch.md" });
  await run("Upgrade Vault", [], { target: "scratch.md" });                    // idempotent
  s = fs.readFileSync(hub, "utf8");
  if (s.includes("<branch>") || !s.includes("(use a `/tree/branch/folder` URL to limit to a folder)")) throw new Error("hub not repaired:\n" + s);
  if (!fs.readFileSync(path.join(V, "_Templates/keep.md"), "utf8").includes("<branch>")) throw new Error("touched _Templates");
  if ((s.match(/```actions/g) || []).length !== 1 || !/^# Old Hub\n```actions\nquick-capture /m.test(s)) throw new Error("buttons not restored once under the title:\n" + s.slice(0, 400));
  // New Tasks notes have the History box; an old one (without it) gets exactly one after two upgrade runs.
  const tasks = path.join(V, "Area/Old Hub/Old Hub - Tasks.md");
  if ((fs.readFileSync(tasks, "utf8").match(/## 📜 History/g) || []).length !== 1) throw new Error("new Tasks note should have one History box");
  fs.writeFileSync(tasks, fs.readFileSync(tasks, "utf8").replace(/\n## 📜 History[\s\S]*$/, "\n"));
  await run("Upgrade Vault", [], { target: "scratch.md" });
  await run("Upgrade Vault", [], { target: "scratch.md" });
  const t = fs.readFileSync(tasks, "utf8");
  if ((t.match(/## 📜 History/g) || []).length !== 1 || !t.includes("> (status.type is DONE) OR (status.type is CANCELLED)")) throw new Error("History box not added exactly once:\n" + t);
  console.log("UPGRADE OK");
})().catch(e => { console.error("FAIL", e); process.exit(1); });
