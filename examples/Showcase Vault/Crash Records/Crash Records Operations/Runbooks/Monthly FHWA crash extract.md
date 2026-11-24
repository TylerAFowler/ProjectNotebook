---
type: runbook
project: "[[Crash Records Operations]]"
frequency: monthly
topic: "Crash data"
related: []
last_run: 2026-11-03
last_reviewed: 2026-11-24
---
# Monthly FHWA crash extract
**Area:** [[Crash Records Operations]] · **Frequency:** monthly

## What it produces / why
- One pipe-delimited file of every crash reported last month (one row per vehicle), uploaded to the FHWA portal for [[Carla Mendes]].

## Inputs & prerequisites
*Access needed, source data, files that must exist first.*
- `crash_rpt` read access on CRASHPRD
- FHWA portal login (shared mailbox account; password in the team vault)

## Steps
1. Wait until the 1st; the nightly load must have run (check `crash_rpt.load_log`).
2. Run the extract query (below) and spool to `fhwa_YYYYMM.txt`.
3. Spot-check: row count within ±10% of last month.
4. Upload to the FHWA portal and email Carla the confirmation number.

## Commands / queries
```sql

```
```sql
-- crash-dashboard/reports/fhwa_monthly.sql
SET COLSEP '|' TRIMSPOOL ON PAGESIZE 0
SPOOL fhwa_202611.txt
@fhwa_monthly.sql
SPOOL OFF
```

## Output: where it goes & who gets it
- FHWA portal → *Monthly crash extract*. Confirmation email to [[Carla Mendes]].

## How to check it worked
- Portal shows *Accepted* within an hour. A *Rejected* status almost always means a new code value (see Gotchas).

## Gotchas
- New vehicle body-type codes (70–79) were added in 2026; the portal rejects unknown codes. See [[FHWA extract missing body-type codes 70-79]].

## 📄 Relevant documents
*Quick Capture → Document → "📘 This note". Location = file path, share/SharePoint path, or URL.*

| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
|          |                              |          |

## 🌐 Useful links
*Quick Capture → Link → "📘 This note".*

| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
|      |                              |     |

## Run log
*`- YYYY-MM-DD — notes`. Also update `last_run` above (and `last_reviewed` when you re-check the steps).*
- 2026-10-02 — normal, 4,812 rows
- 2026-11-03 — re-ran after fixing body-type codes, 4,655 rows
