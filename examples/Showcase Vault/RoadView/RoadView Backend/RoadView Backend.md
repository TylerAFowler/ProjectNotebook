---
type: project
kind: project
category:
  - "[[RoadView]]"
  - "[[Cloud Platform]]"
status: active
req_prefix: RVB
repo:
  - https://github.com/TylerAFowler/ObsidianNotesDemo/tree/main/roadview/backend
next_action: Review Sam's resume tests, then plan the cellular load test
started: 2026-09-21
---
# RoadView Backend
❓ [[RoadView Backend - FAQ|FAQ]]
```actions
quick-capture new-meeting new-issue new-note new-requirement refresh-git
```

> [!tip] 🧭 Where I left off
> *Update this every time you switch away.*
> - Resumable uploads: resume + 48h cleanup done on `feature/resumable-uploads`; [[Sam Okafor]] added tests (Nov 23).
> - Next: review the tests, then load-test over cellular. Needs [[Jordan Ellis]]'s firewall rule first.

## ⏳ Waiting on
```tasks
not done
tags include #waiting
path includes {{query.file.folder}}
sort by due
short mode
```
*Quick Capture → "Waiting on", or write `- [ ] #waiting <thing> from [[Person]] 📅 <follow-up date>` in the Tasks note.*

## 📋 Open tasks  ·  [[RoadView Backend - Tasks|full history]]
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
*New: the **Requirement** button above. Changed: open the requirement (or the meeting where it changed) and press **Change requirement**
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
*Add repo URL(s) to the `repo` property (use a `/tree/branch/folder` URL to limit to a folder), then
press **Refresh Git** above. Link a task to a branch with `🌿 branch-name` in the task.*
<!-- git:start -->
*Refreshed 2026-11-24 16:00*

### [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/backend/` · default `main`

**🌿 Task branches**

| Task | Branch | vs default | Last commit | PR |
| ---- | ------ | ---------- | ----------- | -- |
| Resumable uploads for clips over 2 GB | [feature/resumable-uploads](https://github.com/TylerAFowler/ObsidianNotesDemo/tree/feature/resumable-uploads) | 5 ahead · 8 behind | 11-23 backend: tests for resume and cleanup |  |

**Commits on task branches** (not yet in default)
- **Resumable uploads for clips over 2 GB** (`feature/resumable-uploads`)
    - 11-23 [`f437ead`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/f437eade656e02c105acd756026be57da2659b80) backend: tests for resume and cleanup
    - 11-20 [`287ffc0`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/287ffc0dbff190291c5964ee5b1fb9b8ae0a99ba) backend: expire abandoned upload sessions after 48h
    - 11-17 [`2b40a56`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/2b40a568282918e5aa60f375e59bb454a659ba09) backend: resume from last confirmed part after a dropped connection
    - 11-12 [`7c87b27`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/7c87b2753e59daa47d415f3140c3363147fe92d3) backend: start/part/complete endpoints for chunked uploads
    - 11-10 [`ef32430`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/ef324300f126f1e3b253a5633d2415a75660294a) backend: multipart upload session table

**🧾 Recent commits on `main`** touching `roadview/backend/`
- 11-19 [`997d032`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/997d0323782b5201d9758e5c1ddf4ebb5e548985) backend: /health endpoint for the load balancer: sokafor
- 11-18 [`30ac2a4`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/30ac2a46add6ad38a9326073df690362222f4686) backend: store recorded_at in UTC (trucks send local time): alex-rivera
- 10-20 [`7cc6a0b`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/7cc6a0bebd7d5313a219e36bc003ea0fe1d9b780) backend: upload endpoint (single PUT, 2 GB limit): sokafor
- 09-21 [`eceea6a`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/eceea6ab45fc5ed24a225fda7d258737d5fc24f3) roadview/backend: FastAPI skeleton with clip listing: sokafor
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
- 

## ✅ Decisions
*Format: `- YYYY-MM-DD — decision — why`.*
- 

## 💻 Helpful commands
*Quick Capture → Helpful command, or paste a code block here.*
- `uvicorn roadview.backend.api.main:app --reload`

## 📄 Relevant documents
*Quick Capture → Document. Location = file path, share/SharePoint path, or URL.*

| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
|          |                              |          |

## 🌐 Useful links
*Quick Capture → Link.*

| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
| RoadView API (test) | Swagger page for the test API | https://roadview-test.example.gov/docs |

## 🖥️ Environments
| What | Where |
| ---- | ----- |
| Dev  | https://roadview-test.example.gov |
| Prod | https://roadview.example.gov |
| Repo | `roadview/backend` in the demo repo |

## 👥 People
- [[Sam Okafor]]: backend lead
- [[Rita Gomez]]: main customer
- [[Jordan Ellis]]: network / storage

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

