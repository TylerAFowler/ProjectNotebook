<%*
try {
// A runbook belongs either to one area/project (stored in its Runbooks/ folder) or to the Knowledge Base
// (Knowledge Base/Runbooks/) when it's useful everywhere.
const self = tp.config.target_file;
const where = await tp.user.pickProject(tp, false, [{ label: "📚 Knowledge Base (useful across projects)", value: "__kb__" }]);
const kb = where === "__kb__";
const title = (await tp.system.prompt("Runbook title (e.g. Monthly FHWA crash export)"))?.trim();
if (!title) throw new Error("Cancelled. Delete the empty Untitled note.");
const freq = await tp.system.suggester(["Daily", "Weekly", "Monthly", "Quarterly", "Yearly", "Ad hoc / on request", "One-time setup"], ["daily", "weekly", "monthly", "quarterly", "yearly", "ad hoc", "one-time"], false, "How often is it done?") || "ad hoc";
const K = await tp.user.kbParts(tp, { what: "runbook" });
const folder = kb ? "Knowledge Base/Runbooks" : `${where.parent.path}/Runbooks`;
for (const f of kb ? ["Knowledge Base", folder] : [folder]) if (!tp.app.vault.getAbstractFileByPath(f)) await tp.app.vault.createFolder(f);
const path = `${folder}/${title.replace(/[\\/:*?"<>|#^[\]]/g, "-")}.md`;
if (tp.app.vault.getAbstractFileByPath(path)) throw new Error(`"${path}" already exists. Pick another title, then delete this Untitled note.`);
await tp.app.fileManager.renameFile(self, path);
const today = tp.date.now("YYYY-MM-DD");
tR += `---
type: runbook
project: ${kb ? "" : `"[[${where.basename}]]"`}
frequency: ${freq}
${K.yaml}
last_run: 
last_reviewed: ${today}
---
# ${title}
${kb ? "**📚 Knowledge Base**" : `**Area:** [[${where.basename}]]`} · **Frequency:** ${freq}${K.related.length ? ` · **Related:** ${K.related.map(r => `[[${r}]]`).join(", ")}` : ""}

## What it produces / why
- 

## Inputs & prerequisites
*Access needed, source data, files that must exist first.*
- 

## Steps
1. 

## Commands / queries
\`\`\`sql

\`\`\`

## Output: where it goes & who gets it
- 

## How to check it worked
- 

## Gotchas
- 

${K.refs}

## Run log
*\`- YYYY-MM-DD — notes\`. Also update \`last_run\` above (and \`last_reviewed\` when you re-check the steps).*
- `;
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
