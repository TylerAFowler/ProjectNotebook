<%*
try {
const m = window.moment;
const choice = await tp.system.suggester(["This week", "Last week", "Pick a date…"], [0, 1, 2], false, "Which week?");
let ref = m().subtract(choice === 1 ? 1 : 0, "weeks");
if (choice === 2) ref = m((await tp.system.prompt("Any date in that week (YYYY-MM-DD)", m().format("YYYY-MM-DD"))), "YYYY-MM-DD");
const start = ref.clone().startOf("isoWeek"), end = ref.clone().endOf("isoWeek");
let path = `Weekly/${start.format("GGGG-[W]WW")} Weekly Report`;
if (tp.app.vault.getAbstractFileByPath(path + ".md")) path += ` (${m().format("YYYY-MM-DD HHmm")})`;
await tp.file.move(path);
tR += `---\ntype: weekly\nweek_start: ${start.format("YYYY-MM-DD")}\nweek_end: ${end.format("YYYY-MM-DD")}\n---\n`;
tR += await tp.user.weeklyReport(tp, start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
tR += `\n\n---\n*Generated ${m().format("YYYY-MM-DD HH:mm")}. To refresh, delete this note and run the Weekly Report template again.*\n`;
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
