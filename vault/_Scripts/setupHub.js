// Templater user script: tp.user.setupHub(tp, { cats, name, kind, faq })
// Shared by "New Project" and "New Operations". IMPORTANT ORDER: moves the note being created
// into place FIRST (creating other files can make Templater lose track of the "current file"),
// then creates folders, the Tasks note, the optional FAQ, and hubs for any brand-new categories.
async function setupHub(tp, { self, cats, name, kind, faq }) {
  const v = tp.app.vault;
  const today = window.moment().format("YYYY-MM-DD");
  const mkdir = async p => { if (!v.getAbstractFileByPath(p)) await v.createFolder(p); };
  const dir = `${cats[0]}/${name}`;
  if (v.getAbstractFileByPath(dir)) throw new Error(`A folder "${dir}" already exists (maybe from an earlier attempt). Delete it or pick another name, then delete this Untitled note and try again.`);

  await mkdir(cats[0]);
  await mkdir(dir);
  await tp.app.fileManager.renameFile(self, `${dir}/${name}.md`);

  const subs = kind === "operations" ? ["Runbooks", "Meetings", "Issues", "Notes"] : ["Meetings", "Issues", "Notes"];
  for (const s of subs) await mkdir(`${dir}/${s}`);
  for (const c of cats) {
    await mkdir(c);
    if (!v.getAbstractFileByPath(`${c}/${c}.md`)) await v.create(`${c}/${c}.md`, tp.user.categoryHub(c, today));
  }
  const taskSections = kind === "operations"
    ? ["## Recurring",
       "*Repeating jobs, e.g. `- [ ] Generate monthly export 🔁 every month on the 1st 📅 2026-12-01`. Ticking one off creates the next.*",
       "- [ ] ", "",
       "## Requests",
       "*Ad-hoc asks: `- [ ] #request <what> 👤 [[Person]] 📅 <needed by>`. Quick Capture → Request.*",
       "- [ ] ", "",
       "## Tasks", "- [ ] ", ""]
    : ["## Tasks", "- [ ] ", ""];
  await v.create(`${dir}/${name} - Tasks.md`, [
    "---", "type: tasks", `project: "[[${name}]]"`, "cssclasses:", "  - hide-done", "---",
    `# ${name}: Tasks`, "",
    "> [!info] Full task history. **Reading view hides completed and cancelled tasks**: open **📜 History** at the bottom to see them (or Ctrl/Cmd+E).",
    `> Open tasks from here *and* from meeting notes are rolled up on [[${name}]].`, "",
    ...taskSections,
    tp.user.taskHistory(),
  ].join("\n"));
  if (faq) await v.create(`${dir}/${name} - FAQ.md`, tp.user.faqNote(name));
  return dir;
}
module.exports = setupHub;
