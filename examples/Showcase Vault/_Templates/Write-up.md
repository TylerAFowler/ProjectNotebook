<%*
try {
// A personal write-up in the Knowledge Base: how a procedure/policy/system/project works, in your words.
const self = tp.config.target_file;
const title = (await tp.system.prompt("Write-up title (e.g. How WVDOT.saml2 works, Test IdP setup)"))?.trim();
if (!title) throw new Error("Cancelled. Delete the empty Untitled note.");
const kind = await tp.system.suggester(["Procedure / how-to", "Setup guide", "Policy / rules", "System / how it works", "Project write-up / retrospective", "Other"], ["procedure", "setup", "policy", "system", "project", "other"], false, "What kind of write-up?") || "other";
const K = await tp.user.kbParts(tp, { what: "write-up" });
for (const f of ["Knowledge Base", "Knowledge Base/Write-ups"]) if (!tp.app.vault.getAbstractFileByPath(f)) await tp.app.vault.createFolder(f);
const path = `Knowledge Base/Write-ups/${title.replace(/[\\/:*?"<>|#^[\]]/g, "-")}.md`;
if (tp.app.vault.getAbstractFileByPath(path)) throw new Error(`"${path}" already exists. Pick another title, then delete this Untitled note.`);
await tp.app.fileManager.renameFile(self, path);
const today = tp.date.now("YYYY-MM-DD");
const body = {
  procedure: "## Steps\n1. \n\n## Commands\n- ",
  setup: "## Prerequisites\n- \n\n## Steps\n1. \n\n## Config values & where they live\n| Setting | Value / location |\n| ------- | ---------------- |\n|         |                  |\n\n## How to verify\n- ",
  policy: "## The rules\n- \n\n## Who it applies to / when\n- \n\n## Exceptions & how to get one\n- ",
  system: "## How it works\n- \n\n## Components & where they run\n| Component | Where | Notes |\n| --------- | ----- | ----- |\n|           |       |       |\n\n## Data / request flow\n1. ",
  project: "## Goal & outcome\n- \n\n## What we built / changed\n- \n\n## Key decisions & why\n- \n\n## What I'd do differently\n- ",
  other: "## Details\n- ",
}[kind];
tR += `---
type: writeup
kind: ${kind}
${K.yaml}
created: ${today}
last_reviewed: ${today}
---
# ${title}
**📚 Knowledge Base** · ${kind}${K.related.length ? ` · **Related:** ${K.related.map(r => `[[${r}]]`).join(", ")}` : ""}

> [!summary] TL;DR
> 

## Background / context
- 

${body}

## Gotchas
- 

${K.refs}

## Change log
*\`- YYYY-MM-DD — what changed\`. Update \`last_reviewed\` when you re-check this is still accurate.*
- ${today} — created`;
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
