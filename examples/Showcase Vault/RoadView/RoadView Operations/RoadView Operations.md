---
type: project
kind: operations
category:
  - "[[RoadView]]"
status: active
repo: []
started: 2026-11-24
---
# RoadView Operations

> [!info] Ongoing work for [[RoadView]]: recurring jobs, requests and how-tos. Projects are listed on the category page.

## 🔁 Recurring jobs  ·  [[RoadView Operations - Tasks|full history]]
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
- Trucks only upload on depot Wi-Fi unless the cellular pilot flag is set on the truck.

## ✅ Decisions
*Format: `- YYYY-MM-DD — decision — why`.*
- 

## 💻 Helpful commands
*Quick Capture → Helpful command, or paste a code block here.*
- `curl -X POST https://roadview.example.gov/api/admin/requeue/<clip_id>`

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

