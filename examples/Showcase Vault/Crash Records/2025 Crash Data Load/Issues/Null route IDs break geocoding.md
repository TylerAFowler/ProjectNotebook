---
type: issue
project: "[[2025 Crash Data Load]]"
status: fixed
severity: high
found: 2026-11-10
fixed: 2026-11-12
ticket: 
notify:
  - "[[Kevin O'Hara]]"
  - "[[Marcus Bell]]"
---
# Null route IDs break geocoding
**Notify:** [[Kevin O'Hara]], [[Marcus Bell]]
> *status: open → workaround → fixed. Set `fixed:` to the date when resolved. People in `notify` see this issue on their page.*

## Symptoms
- About 3% of 2025 crashes got no latitude/longitude

## Steps to reproduce
1. 

## Cause
- The LRS lookup needs a route ID; the vendor leaves it blank for crashes on local roads

## Workaround
- 

## Fix / follow-up
- [x] Fall back to county + milepost (`etl/geocode.py`, commit on `feature/2025-load`) ✅ 2026-11-12
