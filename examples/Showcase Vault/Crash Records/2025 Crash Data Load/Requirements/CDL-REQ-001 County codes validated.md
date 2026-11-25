---
type: requirement
project: '[[2025 Crash Data Load]]'
req_id: CDL-REQ-001
status: approved
priority: must
version: 2
added: 2026-11-04
last_changed: 2026-11-18
meetings:
  - '[[2026-11-04 2025 load kickoff]]'
  - '[[2026-11-18 Validation rules review]]'
people:
  - '[[Marcus Bell]]'
  - '[[Priya Natarajan]]'
  - '[[Dana Whitfield]]'
  - '[[Kevin O''Hara]]'
---
# CDL-REQ-001: County codes validated
```actions
change-requirement
```
**Project:** [[2025 Crash Data Load]] · **Added:** 2026-11-04 in [[2026-11-04 2025 load kickoff]] · **From:** [[Marcus Bell]], [[Priya Natarajan]]

## Current requirement
Every record's county code must match the state county list, or be a valid FIPS code that maps to one, before it is loaded to prod.

## Acceptance criteria
- [ ] `validation/county_codes.sql` returns 0 rows on the full staging load
- [ ] FIPS codes map through `crash_rpt.county_fips`

## Notes
- 

## Version history
*To record a change: press **Change requirement** at the top (on this note, or in the meeting where it changed).*

| Ver | Date | Change | Why | Meeting | Who |
| --- | ---- | ------ | --- | ------- | --- |
| v1 | 2026-11-04 | Added (proposed, must): Every record's county code must match the state county list before it is loaded to prod. |  | [[2026-11-04 2025 load kickoff]] | [[Marcus Bell]], [[Priya Natarajan]] |
| v2 | 2026-11-18 | Wording: was "Every record's county code must match the state county list before it is loaded to prod." → now "Every record's county code must match the state county list, or be a valid FIPS code that maps to one, before it is loaded to prod."; Status: proposed → approved | Vendor sends FIPS codes for ~4% of records | [[2026-11-18 Validation rules review]] | [[Marcus Bell]], [[Dana Whitfield]], [[Kevin O'Hara]] |

