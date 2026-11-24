---
type: person
role: Front-end Developer
org: IT Applications
email: 
phone: 
---
# Lena Park

## Notes
- RoadView viewer and the crash dashboard UI.

## Meetings with Lena Park
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

## 👤 Lena Park is waiting on me
```tasks
not done
description includes 👤 [[Lena Park]]
sort by due
short mode
```
**Recently done for Lena Park** (let them know!)
```tasks
description includes 👤 [[Lena Park]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Lena Park is waiting on
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

## Requirements Lena Park was involved in
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

## Things I'm waiting on from Lena Park
```tasks
not done
tags include #waiting
description includes Lena Park
short mode
```

