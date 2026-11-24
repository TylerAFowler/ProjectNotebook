---
type: meeting
project: "[[RoadView Frontend]]"
date: 2026-11-17
time: "15:30"
attendees:
  - "[[Lena Park]]"
  - "[[Rita Gomez]]"
---
# Map view demo
**Project:** [[RoadView Frontend]] · **Date:** 2026-11-17 15:30

## Prep / questions to ask
- 

## Agenda
- 

## Notes
- Rita loved the map; wants to click a cluster and see those clips
- Over 500 markers gets slow → clustering

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
- [ ] 
