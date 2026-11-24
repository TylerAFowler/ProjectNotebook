---
type: person
role: Fleet Operations Supervisor
org: Equipment Division
email: 
phone: 
---
# Rita Gomez

## Notes
- Main RoadView customer: trucks, cameras, crash-claim clip requests.

## Meetings with Rita Gomez
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

## 👤 Rita Gomez is waiting on me
```tasks
not done
description includes 👤 [[Rita Gomez]]
sort by due
short mode
```
**Recently done for Rita Gomez** (let them know!)
```tasks
description includes 👤 [[Rita Gomez]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Rita Gomez is waiting on
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

## Requirements Rita Gomez was involved in
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

## Things I'm waiting on from Rita Gomez
```tasks
not done
tags include #waiting
description includes Rita Gomez
short mode
```

