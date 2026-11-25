---
type: project
kind: project
category:
  - "[[Crash Records]]"
status: active
repo:
  - https://github.com/TylerAFowler/ObsidianNotesDemo/tree/main/crash-dashboard/app
next_action: Agree the county map design with Dana
started: 2026-10-01
---
# Crash Dashboard Refresh
```actions
quick-capture new-meeting new-issue new-note new-requirement refresh-git
```

> [!tip] 🧭 Where I left off
> *Update this every time you switch away.*
> - 2025 is in the year filter (waiting on the data load for real data).
> - Next: county density map mock-up for [[Dana Whitfield]].

## ⏳ Waiting on
```tasks
not done
tags include #waiting
path includes {{query.file.folder}}
sort by due
short mode
```
*Quick Capture → "Waiting on", or write `- [ ] #waiting <thing> from [[Person]] 📅 <follow-up date>` in the Tasks note.*

## 📋 Open tasks  ·  [[Crash Dashboard Refresh - Tasks|full history]]
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

### [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `crash-dashboard/app/` · default `main`

**🌿 Task branches**

| Task | Branch | vs default | Last commit | PR |
| ---- | ------ | ---------- | ----------- | -- |
| Replace the parked CSV export with downloads in the new UI | [old/csv-export](https://github.com/TylerAFowler/ObsidianNotesDemo/tree/old/csv-export) | 2 ahead · 17 behind | 10-07 WIP: export endpoint (parked, dashboard refresh will replace this) |  |

**Commits on task branches** (not yet in default)
- **Replace the parked CSV export with downloads in the new UI** (`old/csv-export`)
    - 10-07 [`e4ff8c3`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/e4ff8c33c8b41d18c02215d8ead66b3b456ad2dc) WIP: export endpoint (parked, dashboard refresh will replace this)
    - 10-06 [`a35a7be`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/a35a7be647077d822a93271bee2ce1883888a80f) WIP: CSV export of the county summary

**🧾 Recent commits on `main`** touching `crash-dashboard/app/`
- 11-17 [`778bb97`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/778bb97d16071fe2161ef4aafc1d7ea4b8607273) dashboard: add 2025 to the year filter: alex-rivera
- 09-15 [`b959170`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/b95917031270968bcd8f01af4f3909b0e3e7e83a) crash-dashboard: Flask skeleton and county lookup: alex-rivera
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
- 

## 📄 Relevant documents
*Quick Capture → Document. Location = file path, share/SharePoint path, or URL.*

| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
|          |                              |          |

## 🌐 Useful links
*Quick Capture → Link.*

| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
| Public crash dashboard | The live site; compare against staging before each release | https://crashdata.example.gov |

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

