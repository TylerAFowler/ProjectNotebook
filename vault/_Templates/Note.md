<%*
try {
const proj = await tp.user.pickProject(tp);
const title = (await tp.system.prompt("Note title"))?.trim();
if (!title) throw new Error("Cancelled.");
await tp.file.move(`${proj.parent.path}/Notes/${title.replace(/[\\/:*?"<>|#^[\]]/g, "-")}`);
tR += `---
type: note
project: "[[${proj.basename}]]"
created: ${tp.date.now("YYYY-MM-DD")}
---
# ${title}

`;
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
