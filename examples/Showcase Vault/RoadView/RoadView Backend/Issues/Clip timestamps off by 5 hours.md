---
type: issue
project: "[[RoadView Backend]]"
status: fixed
severity: high
found: 2026-11-16
fixed: 2026-11-20
ticket: 
notify:
  - "[[Rita Gomez]]"
  - "[[Lena Park]]"
---
# Clip timestamps off by 5 hours
**Notify:** [[Rita Gomez]], [[Lena Park]]
> *status: open → workaround → fixed. Set `fixed:` to the date when resolved. People in `notify` see this issue on their page.*

## Symptoms
- Clips show 5 hours later than recorded in the viewer (reported by Rita for a crash claim)

## Steps to reproduce
1. 

## Cause
- Trucks send local time without an offset; the API stored it as UTC

## Workaround
- 

## Fix / follow-up
- [x] Convert to UTC on ingest; viewer shows local time (`fix/clip-timestamp-tz`, merged Nov 20) ✅ 2026-11-20
