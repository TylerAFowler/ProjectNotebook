---
type: person
role: Developer
org: IT Applications
email: 
phone: 
---
# Sam Okafor

## Notes
- RoadView backend lead. Pairs with me on resumable uploads.

## Meetings with Sam Okafor
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

## 👤 Sam Okafor is waiting on me
```tasks
not done
description includes 👤 [[Sam Okafor]]
sort by due
short mode
```
**Recently done for Sam Okafor** (let them know!)
```tasks
description includes 👤 [[Sam Okafor]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Sam Okafor is waiting on
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

## Requirements Sam Okafor was involved in
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

## Things I'm waiting on from Sam Okafor
```tasks
not done
tags include #waiting
description includes Sam Okafor
short mode
```

