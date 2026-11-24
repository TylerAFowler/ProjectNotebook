---
type: writeup
kind: system
topic: "Crash data"
related:
  - "[[2025 Crash Data Load]]"
  - "[[Crash Dashboard Refresh]]"
  - "[[Crash Records]]"
created: 2026-11-24
last_reviewed: 2026-11-24
---
# How the crash data pipeline works
**📚 Knowledge Base** · system · **Related:** [[2025 Crash Data Load]], [[Crash Dashboard Refresh]], [[Crash Records]]

> [!summary] TL;DR
> Police reports → e-crash portal → nightly load into `crash_rpt` → dashboard and FHWA extract. Yearly vendor extracts go through `crash_stg` first.

## Background / context
- 

## How it works
- 

## Components & where they run
| Component | Where | Notes |
| --------- | ----- | ----- |
| Component | Where | Notes |
| --- | --- | --- |
| e-crash portal | vendor-hosted | officers' entry point |
| crash_rpt | CRASHPRD | source of truth |
| crash_stg | CRASHDEV | yearly loads; wiped Sundays |
| Dashboard | `crash-dashboard/app` | public |

## Data / request flow
1. Officers file reports in the e-crash portal.
2. Nightly job loads them into `crash_rpt` (CRASHPRD).
3. Geocoding via LRS v2 (fallback: county + milepost).
4. Dashboard reads `crash_rpt`; monthly FHWA extract runs on the 1st.

## Gotchas
- 

## 📄 Relevant documents
*Quick Capture → Document → "📘 This note". Location = file path, share/SharePoint path, or URL.*

| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
| Pipeline architecture diagram | Every hop from the e-crash portal to the dashboard | `\\fileserver\CrashRecords\Architecture\pipeline.vsdx` |

## 🌐 Useful links
*Quick Capture → Link → "📘 This note".*

| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
|      |                              |     |

## Change log
*`- YYYY-MM-DD — what changed`. Update `last_reviewed` when you re-check this is still accurate.*
- 2026-11-24 — created
