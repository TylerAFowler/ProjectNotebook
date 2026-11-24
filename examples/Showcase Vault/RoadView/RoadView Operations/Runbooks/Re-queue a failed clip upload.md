---
type: runbook
project: "[[RoadView Operations]]"
frequency: ad hoc
topic: "RoadView"
related: []
last_run: 
last_reviewed: 2026-11-24
---
# Re-queue a failed clip upload
**Area:** [[RoadView Operations]] · **Frequency:** ad hoc

## What it produces / why
- 

## Inputs & prerequisites
*Access needed, source data, files that must exist first.*
- 

## Steps
1. Find the clip in the admin page (filter *Failed*).
2. Check the truck was on Wi-Fi when it failed; if not, wait for the next depot visit.
3. POST to `/api/admin/requeue/<clip_id>` (command on the area hub).
4. Confirm it shows *Uploaded* within 15 minutes.

## Commands / queries
```sql

```

## Output: where it goes & who gets it
- 

## How to check it worked
- 

## Gotchas
- 

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
- 
