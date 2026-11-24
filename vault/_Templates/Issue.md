<%*
try {
const proj = await tp.user.pickProject(tp);
const title = (await tp.system.prompt("Issue title (short description)"))?.trim();
if (!title) throw new Error("Cancelled.");
const sev = await tp.system.suggester(["High", "Medium", "Low"], ["high", "medium", "low"], false, "Severity") || "medium";
const notify = ((await tp.system.prompt("Who's affected / waiting on the fix? (names, comma-separated, optional)", "")) || "")
  .split(",").map(s => s.trim().replace(/^\[\[|\]\]$/g, "")).filter(Boolean);
const today = tp.date.now("YYYY-MM-DD");
await tp.file.move(`${proj.parent.path}/Issues/${title.replace(/[\\/:*?"<>|#^[\]]/g, "-")}`);
tR += `---
type: issue
project: "[[${proj.basename}]]"
status: open
severity: ${sev}
found: ${today}
fixed: 
ticket: 
notify:${notify.length ? "\n" + notify.map(n => `  - "[[${n}]]"`).join("\n") : " []"}
---
# ${title}${notify.length ? `\n**Notify:** ${notify.map(n => `[[${n}]]`).join(", ")}` : ""}
> *status: open → workaround → fixed. Set \`fixed:\` to the date when resolved. People in \`notify\` see this issue on their page.*

## Symptoms
- 

## Steps to reproduce
1. 

## Cause
- 

## Workaround
- 

## Fix / follow-up
- [ ] `;
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
