---
type: issue
project: "[[2025 Crash Data Load]]"
status: workaround
severity: medium
found: 2026-11-16
fixed: 
ticket: 
notify:
  - "[[Marcus Bell]]"
---
# Vendor file uses FIPS county codes for some records
**Notify:** [[Marcus Bell]]
> *status: open → workaround → fixed. Set `fixed:` to the date when resolved. People in `notify` see this issue on their page.*

## Symptoms
- ~4% of records fail county validation with codes like 54039

## Steps to reproduce
1. 

## Cause
- 

## Workaround
- Map FIPS → state county code via `crash_rpt.county_fips` (needs Priya's grant)

## Fix / follow-up
- [ ] Ask the vendor to send state county codes from the 2026 extract on 📅 2027-01-08
