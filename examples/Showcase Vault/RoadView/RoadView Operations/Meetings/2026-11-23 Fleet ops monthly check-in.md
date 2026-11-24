---
type: meeting
project: "[[RoadView Operations]]"
date: 2026-11-23
time: "09:30"
attendees:
  - "[[Rita Gomez]]"
---
# Fleet ops monthly check-in
**Project:** [[RoadView Operations]] · **Date:** 2026-11-23 09:30

## Prep / questions to ask
- 

## Agenda
- 

## Notes
- 6 new trucks are uploading fine
- Rita needs clips for crash claim 26-0412 by Wednesday
- Large-clip failures on cellular are the #1 complaint (see [[Uploads over 2 GB fail on cellular]])

## Decisions
*Format: `- YYYY-MM-DD — decision — why`. Copy the important ones to the project hub too.*
- 

## 📐 Requirements discussed
*New requirement: Ctrl+P → `Templater: Create _Templates/Requirement.md`. Changed one: `Templater: Insert _Templates/Change Requirement.md`. Run either from this note and it's linked here automatically.*
```base
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
```

## Action items
*Write as tasks (add `📅 date` for a due date). They roll up to the project hub automatically.*
- [ ] Send Rita the cellular pilot plan 👤 [[Rita Gomez]] 📅 2026-12-01 ➕ 2026-11-23
