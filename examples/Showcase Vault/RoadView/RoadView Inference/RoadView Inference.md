---
type: project
kind: project
category:
  - "[[RoadView]]"
  - "[[Cloud Platform]]"
status: active
repo:
  - https://github.com/TylerAFowler/ObsidianNotesDemo/tree/main/roadview/inference
next_action: Decide v8 vs v9 with Nina once the GPU quota is in
started: 2026-11-24
---
# RoadView Inference

> [!tip] 🧭 Where I left off
> *Update this every time you switch away.*
> - [[Nina Shah]]'s v9 results: better accuracy, still fits the nightly window at batch size 8.

## ⏳ Waiting on
```tasks
not done
tags include #waiting
path includes {{query.file.folder}}
sort by due
short mode
```
*Quick Capture → "Waiting on", or write `- [ ] #waiting <thing> from [[Person]] 📅 <follow-up date>` in the Tasks note.*

## 📋 Open tasks  ·  [[RoadView Inference - Tasks|full history]]
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

### [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/inference/` · default `main`

**🌿 Task branches**

| Task | Branch | vs default | Last commit | PR |
| ---- | ------ | ---------- | ----------- | -- |
| Decide on YOLOv9 vs v8 for the nightly run | [experiment/yolo-v9](https://github.com/TylerAFowler/ObsidianNotesDemo/tree/experiment/yolo-v9) | 2 ahead · 5 behind | 11-19 inference: v9 batch size 8 keeps us inside the nightly window |  |

**Commits on task branches** (not yet in default)
- **Decide on YOLOv9 vs v8 for the nightly run** (`experiment/yolo-v9`)
    - 11-19 [`d89068c`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/d89068ce6a8a89194dd6866a711c5ebfd1fc2e89) inference: v9 batch size 8 keeps us inside the nightly window
    - 11-11 [`b9862f1`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/b9862f1e34a7e237cfbdf823727a84572c5542e1) inference: try YOLOv9 weights on the guardrail set

**🧾 Recent commits on `main`** touching `roadview/inference/`
- 09-28 [`28a955c`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/28a955c091002ade4267934692afcf9db00ac1d8) roadview/inference: sign detection batch job: nshah
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

