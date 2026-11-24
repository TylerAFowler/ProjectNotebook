<%*
try {
const proj = await tp.user.pickProject(tp);
const title = (await tp.system.prompt("Meeting title", "Meeting"))?.trim() || "Meeting";
const date = (await tp.system.prompt("Date (YYYY-MM-DD), past or future", tp.date.now("YYYY-MM-DD")))?.trim();
const time = (await tp.system.prompt("Time (optional, e.g. 10:00)", ""))?.trim() || "";
const people = (await tp.system.prompt("Attendees, comma-separated (optional; add later in Properties)", "")) || "";
const att = people.split(",").map(s => s.trim()).filter(Boolean);
await tp.file.move(`${proj.parent.path}/Meetings/${date} ${title.replace(/[\\/:*?"<>|#^[\]]/g, "-")}`);
tR += `---
type: meeting
project: "[[${proj.basename}]]"
date: ${date}
time: ${time ? `"${time}"` : ""}
attendees:${att.length ? "\n" + att.map(a => `  - "[[${a}]]"`).join("\n") : " []"}
---
# ${title}
**Project:** [[${proj.basename}]] · **Date:** ${date}${time ? ` ${time}` : ""}

## Prep / questions to ask
- 

## Agenda
- 

## Notes
- 

## Decisions
*Format: \`- YYYY-MM-DD — decision — why\`. Copy the important ones to the project hub too.*
- 

## 📐 Requirements discussed
*New requirement: Ctrl+P → \`Templater: Create _Templates/Requirement.md\`. Changed one: \`Templater: Insert _Templates/Change Requirement.md\`. Run either from this note and it's linked here automatically.*
\`\`\`base
filters:
  and:
    - type == "requirement"
    - list(meetings).contains(this)
views:
  - type: table
    name: Requirements discussed
    order:
      - file.name
      - note.status
      - note.version
      - note.last_changed
\`\`\`

## Action items
*Write as tasks (add \`📅 date\` for a due date). They roll up to the project hub automatically.*
- [ ] `;
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
