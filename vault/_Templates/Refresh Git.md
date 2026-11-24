<%*
// Run with "Templater: Insert _Templates/Refresh Git.md" (suggested hotkey Ctrl+Shift+G) while in:
//  - a project/operations hub (or any note inside a project) → refreshes its 🧾 Git section
//  - a daily note → refreshes 🧾 Commits (your commits that day, all projects)
// Inserts nothing at your cursor.
try {
const msg = await tp.user.git(tp, "refresh");
new tp.obsidian.Notice(msg, 6000);
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
-%>
