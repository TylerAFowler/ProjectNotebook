---
type: meeting
project: "[[2025 Crash Data Load]]"
date: 2026-11-18
time: "14:00"
attendees:
  - "[[Marcus Bell]]"
  - "[[Dana Whitfield]]"
  - "[[Kevin O'Hara]]"
---
# Validation rules review
```actions
quick-capture new-requirement change-requirement
```
**Project:** [[2025 Crash Data Load]] · **Date:** 2026-11-18 14:00

## Prep / questions to ask
- 

## Agenda
- Walk through the county / route validation queries
- FIPS codes in the vendor file
- Geocoding fallback

## Notes
- About 4% of records use FIPS county codes (54xxx) instead of state codes
- Kevin confirmed county + milepost is accurate enough for the fallback
- Dana will spot-check 50 fallback-geocoded crashes against the paper reports

## Decisions
*Format: `- YYYY-MM-DD — decision — why`. Copy the important ones to the project hub too.*
- 2026-11-18 — Accept FIPS county codes and map them to state codes — rejecting 4% of 2025 is not an option

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
- [ ] Spot-check 50 fallback-geocoded crashes 👤 [[Dana Whitfield]] 📅 2026-12-02 ➕ 2026-11-18
