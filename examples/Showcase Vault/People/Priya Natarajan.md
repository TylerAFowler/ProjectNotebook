---
type: person
role: Database Administrator
org: IT Data Services
email: 
phone: 
---
# Priya Natarajan

## Notes
- Approves schema changes and new database accounts. Prefers a Teams message over email.

## Meetings with Priya Natarajan
```base
filters:
  and:
    - type == "meeting"
    - attendees.contains(this)
views:
  - type: table
    name: Meetings
    order:
      - file.name
      - note.date
      - note.project
    sort:
      - property: note.date
        direction: DESC
```

## 👤 Priya Natarajan is waiting on me
```tasks
not done
description includes 👤 [[Priya Natarajan]]
sort by due
short mode
```
**Recently done for Priya Natarajan** (let them know!)
```tasks
description includes 👤 [[Priya Natarajan]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Priya Natarajan is waiting on
```base
filters:
  and:
    - type == "issue"
    - list(notify).contains(this)
views:
  - type: table
    name: Open
    filters:
      and:
        - 'status != "fixed"'
    order:
      - file.name
      - note.project
      - note.status
      - note.severity
      - note.found
  - type: table
    name: All
    order:
      - file.name
      - note.project
      - note.status
      - note.fixed
```

## Requirements Priya Natarajan was involved in
```base
filters:
  and:
    - type == "requirement"
    - list(people).contains(this)
views:
  - type: table
    name: Requirements
    order:
      - file.name
      - note.project
      - note.status
      - note.version
      - note.last_changed
```

## Things I'm waiting on from Priya Natarajan
```tasks
not done
tags include #waiting
description includes Priya Natarajan
short mode
```

