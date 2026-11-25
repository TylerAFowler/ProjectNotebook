---
type: meeting
project: "[[SSO Migration]]"
date: 2026-11-23
time: "15:00"
attendees:
  - "[[Tom Becker]]"
  - "[[Jordan Ellis]]"
---
# Claims mapping review
```actions
quick-capture new-requirement change-requirement
```
**Project:** [[SSO Migration]] · **Date:** 2026-11-23 15:00

## Prep / questions to ask
- 

## Agenda
- 

## Notes
- Groups claim works on the test IdP
- Users in no mapped group should still see public pages → default role *viewer*
- Saw intermittent *assertion not yet valid* errors (clock skew)

## Decisions
*Format: `- YYYY-MM-DD — decision — why`. Copy the important ones to the project hub too.*
- 

## 📐 Requirements discussed
*New requirement / changed one: the buttons at the top. Run either from this note and it's linked here automatically.*
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
