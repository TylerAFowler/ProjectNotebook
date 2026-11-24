---
type: project
kind: project
category:
  - "[[Crash Records]]"
status: active
req_prefix: CDL
repo:
  - https://github.com/TylerAFowler/ObsidianNotesDemo/tree/main/crash-dashboard/etl
next_action: Run validate.py against the full staging load and send Marcus the summary
started: 2026-11-02
---
# 2025 Crash Data Load
❓ [[2025 Crash Data Load - FAQ|FAQ]]

> [!tip] 🧭 Where I left off
> *Update this every time you switch away.*
> - County and route ID validation are done on `feature/county-validation`; `validate.py` runs both.
> - Next: full staging load, then send the validation summary to [[Marcus Bell]] (due Dec 4).
> - Blocked on [[Priya Natarajan]] for the grant on `crash_rpt.county_fips` (asked Nov 18, follow up Nov 25).

## ⏳ Waiting on
```tasks
not done
tags include #waiting
path includes {{query.file.folder}}
sort by due
short mode
```
*Quick Capture → "Waiting on", or write `- [ ] #waiting <thing> from [[Person]] 📅 <follow-up date>` in the Tasks note.*

## 📋 Open tasks  ·  [[2025 Crash Data Load - Tasks|full history]]
```tasks
not done
tags do not include #waiting
path includes {{query.file.folder}}
sort by status.type
sort by due
sort by priority
short mode
```

## 📐 Requirements
*New: Ctrl+P → `Templater: Create _Templates/Requirement.md`. Changed: `Templater: Insert _Templates/Change Requirement.md`
(run it from the meeting where it changed to link the meeting + attendees). Each requirement keeps its own version history.*
```base
filters:
  and:
    - type == "requirement"
    - project == this
views:
  - type: table
    name: Active
    filters:
      and:
        - 'status != "dropped"'
        - 'status != "deferred"'
    order:
      - note.req_id
      - file.name
      - note.status
      - note.priority
      - note.version
      - note.added
      - note.last_changed
    sort:
      - property: note.req_id
        direction: ASC
  - type: table
    name: Changed in last 30 days
    filters:
      and:
        - last_changed >= today() - "30d"
    order:
      - note.req_id
      - file.name
      - note.status
      - note.version
      - note.last_changed
      - note.meetings
    sort:
      - property: note.last_changed
        direction: DESC
  - type: table
    name: All (incl. deferred/dropped)
    groupBy:
      property: note.status
      direction: ASC
    order:
      - note.req_id
      - file.name
      - note.priority
      - note.version
      - note.added
```

## 🧾 Git
*Add repo URL(s) to the `repo` property (use a /tree/<branch>/<folder> URL to limit to a folder), then
Ctrl+P → Templater: Insert Refresh Git. Link a task to a branch with `🌿 branch-name` in the task.*
<!-- git:start -->
*Refreshed 2026-11-24 16:00*

### [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `crash-dashboard/etl/` · default `main`

**🌿 Task branches**

| Task | Branch | vs default | Last commit | PR |
| ---- | ------ | ---------- | ----------- | -- |
| County and route ID validation | [feature/county-validation](https://github.com/TylerAFowler/ObsidianNotesDemo/tree/feature/county-validation) | 5 ahead · 5 behind | 11-24 etl: run all validations from one script |  |

**Commits on task branches** (not yet in default)
- **County and route ID validation** (`feature/county-validation`)
    - 11-24 [`483e074`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/483e0742e647ab2883fee73771ededcd9b3c2036) etl: run all validations from one script
    - 11-23 [`a88b7ab`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/a88b7abdd56d8c81a41dc2beaa5dbe95ade58a98) etl: validation summary report for Marcus
    - 11-19 [`643cd1c`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/643cd1cc2ea3963f183f684b57c2d4508af30978) etl: route ID validation against LRS v2
    - 11-18 [`a1b7a20`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/a1b7a20d2f5c9f2e44c9d24208fa7b5d9e3bae04) etl: also accept FIPS codes, map them to state codes
    - 11-16 [`1cd5028`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/1cd5028191ea3d0308d18c01f334bf95164b8e85) etl: county code validation query

**🧾 Recent commits on `main`** touching `crash-dashboard/etl/`
- 11-12 [`8c5c185`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/8c5c1852be6b731f2e7024feca8f8cb39a88c5ab) etl: geocode fallback (county + milepost) when route ID is null: alex-rivera
- 11-10 [`ff2e7d0`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/ff2e7d07932a9e559e4f62f2bc64bd4e2359c6b3) etl: skip rows with unparseable dates, log them: alex-rivera
- 11-05 [`5deb7a0`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/5deb7a09699d9441c0e7ca5a1e1cbfca80c7696d) etl: loader for the vendor extract (pipe-delimited): alex-rivera
- 11-03 [`daa9233`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/daa9233eadca202354bd9c6039d9bc9b549e1ac2) etl: staging tables for the 2025 extract: alex-rivera
<!-- git:end -->

## 📚 Related knowledge
*Knowledge Base runbooks/write-ups whose `related` property includes this note.*
```base
filters:
  and:
    - list(related).contains(this)
views:
  - type: table
    name: Related knowledge
    order:
      - file.name
      - note.type
      - note.topic
      - note.last_reviewed
```

## ⚠️ Things to be aware of
- crash_stg is refreshed from prod every Sunday at 02:00. Don't leave test data there.
- The vendor file is UTF-8 with a BOM; open it with encoding='utf-8-sig' or the first column name is wrong.

## ✅ Decisions
*Format: `- YYYY-MM-DD — decision — why`.*
- 2026-11-24 — Use LRS v2 for route lookups. v1 is retired in March.

## 💻 Helpful commands
*Quick Capture → Helpful command, or paste a code block here.*
- `python crash-dashboard/etl/load_2025.py /data/vendor/crash_2025.txt`
- `python crash-dashboard/etl/validate.py`

## 📄 Relevant documents
*Quick Capture → Document. Location = file path, share/SharePoint path, or URL.*

| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
| 2025 vendor extract layout | Every field in the vendor file with types and code lists; use when mapping to staging | `\\fileserver\CrashRecords\Specs\2025_extract_layout.xlsx` |
| Schema change request CR-1187 | Approved change for the new staging tables (Priya's sign-off is on page 2) | https://sharepoint.example.gov/sites/crash/Shared%20Documents/CR-1187.docx |

## 🌐 Useful links
*Quick Capture → Link.*

| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
| LRS v2 API docs | Route lookup and county/milepost endpoints used by geocode.py | https://lrs.example.gov/api/v2/docs |

## 🖥️ Environments
| What | Where |
| ---- | ----- |
| Dev  | `crash_stg` on CRASHDEV |
| Prod | `crash_rpt` on CRASHPRD |
| Repo | `crash-dashboard/etl` in the demo repo |

## 👥 People
- [[Marcus Bell]]: business owner, signs off on staging
- [[Priya Natarajan]]: DBA, grants and schema changes
- [[Kevin O'Hara]]: LRS questions
- [[Dana Whitfield]]: tester / main user

## 🐞 Open issues
```base
filters:
  and:
    - type == "issue"
    - project == this
views:
  - type: table
    name: Open
    filters:
      and:
        - 'status != "fixed"'
    order:
      - file.name
      - note.status
      - note.severity
      - note.notify
      - note.found
    sort:
      - property: note.found
        direction: DESC
  - type: table
    name: All
    order:
      - file.name
      - note.status
      - note.severity
      - note.found
      - note.fixed
```

## 🗓️ Meetings
```base
filters:
  and:
    - type == "meeting"
    - project == this
views:
  - type: table
    name: Upcoming
    filters:
      and:
        - date >= today()
    order:
      - file.name
      - note.date
      - note.time
      - note.attendees
    sort:
      - property: note.date
        direction: ASC
  - type: table
    name: Past
    filters:
      and:
        - date < today()
    order:
      - file.name
      - note.date
      - note.attendees
    sort:
      - property: note.date
        direction: DESC
```

## 📝 Notes
```base
filters:
  and:
    - project == this
    - or:
        - type == "note"
        - type == "runbook"
views:
  - type: table
    name: Notes
    order:
      - file.name
      - note.type
      - file.mtime
    sort:
      - property: file.mtime
        direction: DESC
```

