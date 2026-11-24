---
type: meeting
project: "[[Crash Records Operations]]"
date: 2026-11-19
time: "13:00"
attendees:
  - "[[Marcus Bell]]"
  - "[[Dana Whitfield]]"
---
# Safety Committee data check-in
**Project:** [[Crash Records Operations]] · **Date:** 2026-11-19 13:00

## Prep / questions to ask
- 

## Agenda
- Status of the 2025 data load
- Fatal crash counts for the December committee packet

## Notes
- Marcus needs 2025 fatal counts by county before Thanksgiving
- Dana asked for US-119 corridor history (2021–2025) for a corridor study

## Decisions
*Format: `- YYYY-MM-DD — decision — why`. Copy the important ones to the project hub too.*
- 2026-11-19 — Preliminary 2025 numbers are OK for the committee packet if labelled preliminary — final numbers come after the staging sign-off

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
- [x] Send Marcus 2025 fatal crash counts by county 👤 [[Marcus Bell]] 📅 2026-11-25 ➕ 2026-11-19 ✅ 2026-11-23
