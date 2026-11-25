# 🏠 Home
```actions
quick-capture new-meeting new-issue new-project open-today weekly-review open-help
```
📚 [[Knowledge Base]]: your runbooks & write-ups · 🔗 [[General Docs & Links]]: pointers to external docs & URLs · 🧾 [[Git Activity]]: all commits, last 7 days · ⌨️ [[Commands and hotkeys]]

## 🧭 Active projects: where I left off
```base
filters:
  and:
    - type == "project"
    - kind != "operations"
views:
  - type: table
    name: Active
    filters:
      and:
        - 'status == "active"'
    order:
      - file.name
      - note.category
      - note.next_action
      - file.mtime
    sort:
      - property: file.mtime
        direction: DESC
  - type: table
    name: All projects
    groupBy:
      property: note.category
      direction: ASC
    order:
      - file.name
      - note.status
      - note.next_action
      - file.mtime
```

## ⚙️ Operations (ongoing work)
```base
filters:
  and:
    - type == "project"
    - kind == "operations"
views:
  - type: table
    name: Operations
    order:
      - file.name
      - note.category
      - file.mtime
```

## 🔥 Overdue
```tasks
not done
due before today
sort by due
group by folder
short mode
```

## 📅 Due this week & next
```tasks
not done
(due this week) OR (due next week)
tags do not include #waiting
sort by due
group by folder
short mode
```

## 👤 Others waiting on me
*Tasks with \`👤 [[Person]]\`: people waiting on them / to tell when done.*
```tasks
not done
description includes 👤
sort by due
group by folder
short mode
```

## ⏳ Waiting on others
```tasks
not done
tags include #waiting
sort by due
group by folder
short mode
```

## 🔄 In progress
```tasks
status.type is IN_PROGRESS
group by folder
short mode
```

## 🐞 Open issues (all projects)
```base
filters:
  and:
    - type == "issue"
    - 'status != "fixed"'
views:
  - type: table
    name: Open issues
    order:
      - file.name
      - note.project
      - note.severity
      - note.status
      - note.found
    sort:
      - property: note.found
        direction: DESC
```

## 📆 Upcoming meetings
```base
filters:
  and:
    - type == "meeting"
    - date >= today()
views:
  - type: table
    name: Upcoming meetings
    order:
      - file.name
      - note.project
      - note.date
      - note.time
      - note.attendees
    sort:
      - property: note.date
        direction: ASC
```

## 🗓️ Meetings in the last 2 weeks
```base
filters:
  and:
    - type == "meeting"
    - date >= today() - "14d"
    - date < today()
views:
  - type: table
    name: Recent meetings
    order:
      - file.name
      - note.project
      - note.attendees
      - note.date
    sort:
      - property: note.date
        direction: DESC
```

## 📆 Weekly reports
```base
filters:
  and:
    - type == "weekly"
views:
  - type: table
    name: Weekly reports
    limit: 8
    order:
      - file.name
      - note.week_start
    sort:
      - property: note.week_start
        direction: DESC
```
