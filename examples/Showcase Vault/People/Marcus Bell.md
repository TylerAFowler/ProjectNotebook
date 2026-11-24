---
type: person
role: Crash Records Program Manager
org: Traffic Safety Division
email: 
phone: 
---
# Marcus Bell

## Notes
- Business owner for crash data and the public dashboard. Signs off on staging before anything goes to prod.

## Meetings with Marcus Bell
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

## 👤 Marcus Bell is waiting on me
```tasks
not done
description includes 👤 [[Marcus Bell]]
sort by due
short mode
```
**Recently done for Marcus Bell** (let them know!)
```tasks
description includes 👤 [[Marcus Bell]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Marcus Bell is waiting on
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

## Requirements Marcus Bell was involved in
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

## Things I'm waiting on from Marcus Bell
```tasks
not done
tags include #waiting
description includes Marcus Bell
short mode
```

