---
type: meeting
project: "[[Crash Dashboard Refresh]]"
date: 2026-11-10
time: "15:00"
attendees:
  - "[[Marcus Bell]]"
  - "[[Dana Whitfield]]"
  - "[[Lena Park]]"
---
# Dashboard refresh scope
**Project:** [[Crash Dashboard Refresh]] · **Date:** 2026-11-10 15:00

## Prep / questions to ask
- 

## Agenda
- 

## Notes
- Dana wants a county density map more than anything else
- Marcus: downloads (CSV/Excel) are a must for the public
- Lena can reuse the RoadView map component

## Decisions
*Format: `- YYYY-MM-DD — decision — why`. Copy the important ones to the project hub too.*
- 2026-11-10 — Reuse the RoadView Leaflet map component — one map stack to maintain

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
