---
type: issue
project: "[[Crash Records Operations]]"
status: fixed
severity: medium
found: 2026-11-04
fixed: 2026-11-17
ticket: SD-48211
notify:
  - "[[Carla Mendes]]"
---
# FHWA extract missing body-type codes 70-79
**Notify:** [[Carla Mendes]]
> *status: open → workaround → fixed. Set `fixed:` to the date when resolved. People in `notify` see this issue on their page.*

## Symptoms
- FHWA portal rejected the November extract: *unknown BODY_TYPE 74*

## Steps to reproduce
1. Run the extract for any month after 2026-07
2. Upload: portal rejects rows with body types 70–79

## Cause
- The 2026 crash form added body-type codes 70–79 (e-bikes, scooters); the extract's lookup table didn't have them.

## Workaround
- 

## Fix / follow-up
- [x] Add codes 70–79 to `crash_rpt.body_type_map` ✅ 2026-11-17
- [ ] Update the FHWA extract runbook for the new codes 🔽
