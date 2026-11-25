<%*
try {
// New requirement → <Project>/Requirements/<ID> <Title>.md
// Run it from inside a meeting note to link that meeting (and its attendees) automatically.
const self = tp.config.target_file, act = tp.config.active_file;
const proj = await tp.user.pickProject(tp);
const title = (await tp.system.prompt("Requirement title (short)"))?.trim();
if (!title) throw new Error("Cancelled. Delete the empty Untitled note.");
const text = (await tp.system.prompt("The requirement (full wording)", "", false, true))?.trim() || title;
const priority = await tp.system.suggester(["Must have", "Should have", "Could have", "Won't have (this time)"], ["must", "should", "could", "won't"], false, "Priority") || "should";
const status = await tp.system.suggester(["Proposed", "Approved"], ["proposed", "approved"], false, "Status") || "proposed";
const meeting = await tp.user.req(tp, "pickMeeting", { hub: proj, prefer: act });
const people = await tp.user.req(tp, "people", { meeting });
const id = await tp.user.req(tp, "nextId", { hub: proj });
const folder = `${proj.parent.path}/Requirements`;
if (!tp.app.vault.getAbstractFileByPath(folder)) await tp.app.vault.createFolder(folder);
const path = `${folder}/${id} ${title.replace(/[\\/:*?"<>|#^[\]]/g, "-")}.md`;
await tp.app.fileManager.renameFile(self, path);
const today = await tp.user.req(tp, "dateFor", { meeting });  // meeting date when recorded from a meeting
const mLink = meeting ? `[[${meeting.basename}]]` : "";
const firstRow = await tp.user.req(tp, "row", { cells: ["v1", today, `Added (${status}, ${priority}): ${text}`, "", mLink, people.join(", ")] });
const yamlList = xs => xs.length ? "\n" + xs.map(x => `  - "${x}"`).join("\n") : " []";
tR += `---
type: requirement
project: "[[${proj.basename}]]"
req_id: ${id}
status: ${status}
priority: ${priority}
version: 1
added: ${today}
last_changed: ${today}
meetings:${yamlList(meeting ? [mLink] : [])}
people:${yamlList(people)}
---
# ${id}: ${title}
\`\`\`actions
change-requirement
\`\`\`
**Project:** [[${proj.basename}]] · **Added:** ${today}${mLink ? ` in ${mLink}` : ""}${people.length ? ` · **From:** ${people.join(", ")}` : ""}

## Current requirement
${text}

## Acceptance criteria
- 

## Notes
- 

## Version history
*To record a change: press **Change requirement** at the top (on this note, or in the meeting where it changed).*

| Ver | Date | Change | Why | Meeting | Who |
| --- | ---- | ------ | --- | ------- | --- |
${firstRow}
`;
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
