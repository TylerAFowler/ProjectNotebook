---
type: meeting
project: "[[RoadView Backend]]"
date: 2026-11-09
time: "11:00"
attendees:
  - "[[Sam Okafor]]"
  - "[[Rita Gomez]]"
  - "[[Jordan Ellis]]"
---
# Upload reliability review
**Project:** [[RoadView Backend]] · **Date:** 2026-11-09 11:00

## Prep / questions to ask
- 

## Agenda
- 

## Notes
- 1 in 8 clips over 2 GB fails when trucks upload on cellular
- Raising the size limit doesn't help; connections drop mid-upload
- Jordan: object storage supports multipart uploads with 64 MB parts

## Decisions
*Format: `- YYYY-MM-DD — decision — why`. Copy the important ones to the project hub too.*
- 2026-11-09 — Chunked multipart uploads (64 MB parts) instead of raising the size limit — trucks lose signal mid-upload

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
- [ ] 
