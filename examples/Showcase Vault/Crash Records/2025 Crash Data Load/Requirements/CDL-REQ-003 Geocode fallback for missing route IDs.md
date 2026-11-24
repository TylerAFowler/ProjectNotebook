---
type: requirement
project: '[[2025 Crash Data Load]]'
req_id: CDL-REQ-003
status: approved
priority: must
version: 2
added: 2026-11-04
last_changed: 2026-11-18
meetings:
  - '[[2026-11-04 2025 load kickoff]]'
  - '[[2026-11-18 Validation rules review]]'
people:
  - '[[Kevin O''Hara]]'
  - '[[Marcus Bell]]'
---
# CDL-REQ-003: Geocode fallback for missing route IDs
**Project:** [[2025 Crash Data Load]] · **Added:** 2026-11-04 in [[2026-11-04 2025 load kickoff]] · **From:** [[Kevin O'Hara]]

## Current requirement
When the route ID is missing, locate the crash from county + milepost and flag it as approximate.

## Acceptance criteria
- [x] Fallback implemented in `etl/geocode.py`
- [ ] Dana's 50-crash spot-check passes

## Notes
- 

## Version history
*To record a change: Ctrl+P → `Templater: Insert _Templates/Change Requirement.md` (on this note, or from the meeting where it changed).*

| Ver | Date | Change | Why | Meeting | Who |
| --- | ---- | ------ | --- | ------- | --- |
| v1 | 2026-11-04 | Added (proposed, should): When the route ID is missing, locate the crash from county + milepost. |  | [[2026-11-04 2025 load kickoff]] | [[Kevin O'Hara]] |
| v2 | 2026-11-18 | Wording: was "When the route ID is missing, locate the crash from county + milepost." → now "When the route ID is missing, locate the crash from county + milepost and flag it as approximate."; Status: proposed → approved; Priority: should → must | 3% of records have no route ID; dashboard needs them on the map | [[2026-11-18 Validation rules review]] | [[Kevin O'Hara]], [[Marcus Bell]] |

