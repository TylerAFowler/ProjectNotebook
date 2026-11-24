// Templater user script: tp.user.pickProject(tp)
// Shows a picker of every project hub (notes with `type: project`).
// tp.user.pickProject(tp, true) also offers "General Docs & Links" and returns the string "__general__" for it.
// The project you were last in (the active note when you ran the template) is listed first.
// tp.user.pickProject(tp, false, [{label, value}]) puts extra choices at the top of the list.
async function pickProject(tp, allowGeneral = false, extras = []) {
  const app = tp.app;
  const projects = app.vault.getMarkdownFiles().filter(f =>
    !f.path.startsWith("_Templates/") &&
    app.metadataCache.getFileCache(f)?.frontmatter?.type === "project"
  );
  if (!projects.length && !allowGeneral && !extras.length) throw new Error("No projects yet. Create one with the 'New Project' template first.");

  const active = tp.config.active_file;
  const owns = p => (active && active.path.startsWith(p.parent.path + "/")) ? 1 : 0;
  projects.sort((a, b) => (owns(b) - owns(a)) || a.path.localeCompare(b.path));

  const isOps = p => app.metadataCache.getFileCache(p)?.frontmatter?.kind === "operations";
  const labels = projects.map(p => `${isOps(p) ? "⚙️ " : ""}${p.parent.parent?.name ?? ""} / ${p.basename}`);
  const values = [...projects];
  labels.unshift(...extras.map(e => e.label)); values.unshift(...extras.map(e => e.value));
  if (allowGeneral) { labels.push("📚 General Docs & Links (not a project)"); values.push("__general__"); }
  const pick = await tp.system.suggester(labels, values, false, "Which project?");
  if (!pick) throw new Error("Cancelled. Delete the empty Untitled note if one was created.");
  return pick;
}
module.exports = pickProject;
