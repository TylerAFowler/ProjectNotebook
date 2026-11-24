---
type: note
project: "[[2025 Crash Data Load]]"
created: 2026-11-24
---
# Validation approach


Each check is one SQL file in `crash-dashboard/etl/validation/` returning the failing rows. `validate.py` runs them all and prints counts; the summary for Marcus is the counts plus 10 sample rows per check.

| Check | Requirement | Expected failures |
| ----- | ----------- | ----------------- |
| County codes | [[CDL-REQ-001 County codes validated]] | 0 after FIPS mapping |
| Route IDs | [[CDL-REQ-002 Route IDs checked against LRS v2]] | < 0.5% (reported, not dropped) |
