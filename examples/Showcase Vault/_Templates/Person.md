<%*
try {
const name = (await tp.system.prompt("Person's name"))?.trim();
if (!name) throw new Error("Cancelled.");
await tp.file.move(`People/${name}`);
const F = "```";
tR += `---
type: person
role: 
org: 
email: 
phone: 
---
# ${name}

## Notes
- 

## Meetings with ${name}
${F}base
filters:
  and:
    - type == "meeting"
    - attendees.contains(this)
views:
  - type: table
    name: Meetings
    order:
      - file.name
      - note.date
      - note.project
    sort:
      - property: note.date
        direction: DESC
${F}

## 👤 ${name} is waiting on me
${F}tasks
not done
description includes 👤 [[${name}]]
sort by due
short mode
${F}
**Recently done for ${name}** (let them know!)
${F}tasks
description includes 👤 [[${name}]]
(done this month) OR (done last month)
sort by done reverse
short mode
${F}

## 🐞 Issues ${name} is waiting on
${F}base
filters:
  and:
    - type == "issue"
    - list(notify).contains(this)
views:
  - type: table
    name: Open
    filters:
      and:
        - 'status != "fixed"'
    order:
      - file.name
      - note.project
      - note.status
      - note.severity
      - note.found
  - type: table
    name: All
    order:
      - file.name
      - note.project
      - note.status
      - note.fixed
${F}

## Requirements ${name} was involved in
${F}base
filters:
  and:
    - type == "requirement"
    - list(people).contains(this)
views:
  - type: table
    name: Requirements
    order:
      - file.name
      - note.project
      - note.status
      - note.version
      - note.last_changed
${F}

## Things I'm waiting on from ${name}
${F}tasks
not done
tags include #waiting
description includes ${name}
short mode
${F}
`;
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
