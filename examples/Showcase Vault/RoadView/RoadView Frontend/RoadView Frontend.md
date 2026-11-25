---
type: project
kind: project
category:
  - "[[RoadView]]"
status: active
repo:
  - https://github.com/TylerAFowler/ObsidianNotesDemo/tree/main/roadview/frontend
next_action: Review Lena's map clustering branch
started: 2026-11-24
---
# RoadView Frontend
```actions
quick-capture new-meeting new-issue new-note new-requirement refresh-git
```

> [!tip] 🧭 Where I left off
> *Update this every time you switch away.*
> - Paging and timestamp fixes are merged.
> - Next: review `feature/map-clustering` from [[Lena Park]].

## ⏳ Waiting on
```tasks
not done
tags include #waiting
path includes {{query.file.folder}}
sort by due
short mode
```
*Quick Capture → "Waiting on", or write `- [ ] #waiting <thing> from [[Person]] 📅 <follow-up date>` in the Tasks note.*

## 📋 Open tasks  ·  [[RoadView Frontend - Tasks|full history]]
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

### [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/frontend/` · default `main`

**🌿 Task branches**

| Task | Branch | vs default | Last commit | PR |
| ---- | ------ | ---------- | ----------- | -- |
| Review Lena's map clustering branch | [feature/map-clustering](https://github.com/TylerAFowler/ObsidianNotesDemo/tree/feature/map-clustering) | 3 ahead · 5 behind | 11-23 frontend: click a cluster to filter the clip list |  |

**Commits on task branches** (not yet in default)
- **Review Lena's map clustering branch** (`feature/map-clustering`)
    - 11-23 [`b1794cb`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/b1794cbbe8cbd0d5c7b0be5de11e9fcca083016e) frontend: click a cluster to filter the clip list
    - 11-19 [`26f472e`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/26f472e043eb699ecf207196a2a57000d332d131) frontend: cluster markers above 500 points
    - 11-17 [`283858b`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/283858b2527c6259033990c6de86d7be005d1483) frontend: map view of clip locations

**🧾 Recent commits on `main`** touching `roadview/frontend/`
- 11-20 [`15952e6`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/15952e65f60b4d2d9b90e587faa46d98fed116c6) frontend: fix clip list paging (page 2 repeated page 1): lpark
- 11-19 [`867f42e`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/867f42e004fc8998017cb35860ad17b758e1d3cd) frontend: show clip time in the viewer's time zone: alex-rivera
- 10-27 [`60b8bf4`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/60b8bf496de8fbc8f459002186753003f1e6182c) frontend: clip viewer with timestamp overlay: lpark
- 09-22 [`c8fc7ee`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/c8fc7eefae89e70f8679406c24b19c4165d18049) roadview/frontend: Vite + React skeleton, clip list: lpark
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
|      |                              |     |

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

