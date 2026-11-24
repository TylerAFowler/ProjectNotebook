---
type: meeting
project: "[[SSO Migration]]"
date: 2026-11-16
time: "13:00"
attendees:
  - "[[Tom Becker]]"
  - "[[Jordan Ellis]]"
---
# SSO kickoff
**Project:** [[SSO Migration]] · **Date:** 2026-11-16 13:00

## Prep / questions to ask
- 

## Agenda
- 

## Notes
- Crash dashboard admin pages move off local accounts to SAML
- MFA is enforced at the IdP, not in the app
- Test IdP first; prod needs a change window (2 weeks' notice)

## Decisions
*Format: `- YYYY-MM-DD — decision — why`. Copy the important ones to the project hub too.*
- 2026-11-16 — Crash dashboard is the first app on SAML — smallest user base, internal only

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
