<%*
try {
// Creates (or recreates) a category hub note: <Category>/<Category>.md
// To refresh an old hub: delete it first, then run this and pick that category.
const self = tp.config.target_file;
const SKIP = ["_Templates", "_Scripts", "Daily", "People", "Weekly", "Knowledge Base"];
const v = tp.app.vault;
const cats = v.getRoot().children.filter(f => f.children !== undefined && !SKIP.includes(f.name) && !f.name.startsWith(".")).map(f => f.name).sort();
let cat = await tp.system.suggester([...cats, "➕ New category…"], [...cats, "__new__"], false, "Category");
if (cat === "__new__") cat = (await tp.system.prompt("New category name"))?.trim();
if (!cat) throw new Error("Cancelled. Delete the empty Untitled note.");
if (v.getAbstractFileByPath(`${cat}/${cat}.md`)) throw new Error(`"${cat}/${cat}.md" already exists. Delete it first if you want to recreate it, then delete this Untitled note and try again.`);
if (!v.getAbstractFileByPath(cat)) await v.createFolder(cat);
await tp.app.fileManager.renameFile(self, `${cat}/${cat}.md`);
tR += tp.user.categoryHub(cat, tp.date.now("YYYY-MM-DD"));
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
