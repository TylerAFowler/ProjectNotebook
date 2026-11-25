<%*
// Run with "Project Notes: Forget saved Git tokens" to clear stored GitHub tokens on this computer
// (e.g. a token expired, or you want to switch accounts). You'll be asked for a new one next refresh.
try {
new tp.obsidian.Notice(await tp.user.git(tp, "forget"), 8000);
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
-%>
