---
type: project
kind: operations
category:
  - "[[Crash Records]]"
status: active
repo:
  - https://github.com/TylerAFowler/ObsidianNotesDemo/tree/main/crash-dashboard/reports
started: 2026-11-24
---
# Crash Records Operations

> [!info] Ongoing work for [[Crash Records]]: recurring jobs, requests and how-tos. Projects are listed on the category page.

## 🔁 Recurring jobs  ·  [[Crash Records Operations - Tasks|full history]]
```tasks
not done
is recurring
path includes {{query.file.folder}}
sort by due
short mode
```

## 📬 Open requests
```tasks
not done
tags include #request
path includes {{query.file.folder}}
sort by due
short mode
```
**Recently delivered**
```tasks
tags include #request
(done this month) OR (done last month)
path includes {{query.file.folder}}
sort by done reverse
short mode
```

## ⏳ Waiting on
```tasks
not done
tags include #waiting
path includes {{query.file.folder}}
sort by due
short mode
```
*Quick Capture → "Waiting on", or write `- [ ] #waiting <thing> from [[Person]] 📅 <follow-up date>` in the Tasks note.*

## 📋 Other open tasks
```tasks
not done
is not recurring
tags do not include #waiting
tags do not include #request
path includes {{query.file.folder}}
sort by due
sort by priority
short mode
```

## 📘 Runbooks
*How to do each routine job. Ctrl+P → Templater: Create _Templates/Runbook.md*
```base
filters:
  and:
    - type == "runbook"
    - project == this
views:
  - type: table
    name: Runbooks
    order:
      - file.name
      - note.frequency
      - note.last_run
```

## 🧾 Git
*Add repo URL(s) to the `repo` property (use a /tree/<branch>/<folder> URL to limit to a folder), then
Ctrl+P → Templater: Insert Refresh Git. Link a task to a branch with `🌿 branch-name` in the task.*
<!-- git:start -->
*Refreshed 2026-11-24 16:00*

### [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `crash-dashboard/reports/` · default `main`

**🧾 Recent commits on `main`** touching `crash-dashboard/reports/`
- 11-23 [`fb13e4f`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/fb13e4fe96b6bed27e6cb72b64bbd2e148e947f5) reports: fatal crash counts by county (request from Marcus): alex-rivera
- 10-14 [`14520fa`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/14520fafdf592bd318ee2f05f8e6dca7f427045b) reports: FHWA monthly extract query: alex-rivera
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

## 📅 Deliverables schedule
| Deliverable | Recipient | Frequency | Runbook |
| ----------- | --------- | --------- | ------- |
| Monthly FHWA crash extract | Carla Mendes (FHWA) | Monthly, by the 5th | [[Monthly FHWA crash extract]] |
| Quarterly fatality report | Safety Committee via Marcus Bell | Quarterly, by the 15th | [[Quarterly fatality report]] |

## ⚠️ Things to be aware of
- FHWA wants the extract pipe-delimited, not CSV. Location descriptions contain commas.
- The last 30 days of crash data are preliminary. Say so in every ad-hoc request.

## ✅ Decisions
*Format: `- YYYY-MM-DD — decision — why`.*
- 2026-11-24 — Ad-hoc requests covering more than 5 years go through Marcus first. Keeps the queue sane.

## 💻 Helpful commands
*Quick Capture → Helpful command, or paste a code block here.*
- `sqlplus crash_rpt@CRASHPRD @crash-dashboard/reports/fhwa_monthly.sql`

## 📄 Relevant documents
*Quick Capture → Document. Location = file path, share/SharePoint path, or URL.*

| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
|          |                              |          |

## 🌐 Useful links
*Quick Capture → Link.*

| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
| FHWA crash data portal | Where the monthly extract is uploaded | https://fhwa-portal.example.gov/crash-upload |

## 🖥️ Environments
| What | Where |
| ---- | ----- |
| Dev  |       |
| Prod |       |
| Repo |       |

## 👥 People
- 

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

