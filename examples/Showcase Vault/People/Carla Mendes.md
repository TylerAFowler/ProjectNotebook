---
type: person
role: Safety Specialist
org: FHWA Division Office
email: 
phone: 
---
# Carla Mendes

## Notes
- Outside the agency. Receives the monthly FHWA crash extract.

## Meetings with Carla Mendes
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

## 👤 Carla Mendes is waiting on me
```tasks
not done
description includes 👤 [[Carla Mendes]]
sort by due
short mode
```
**Recently done for Carla Mendes** (let them know!)
```tasks
description includes 👤 [[Carla Mendes]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Carla Mendes is waiting on
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

## Requirements Carla Mendes was involved in
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

## Things I'm waiting on from Carla Mendes
```tasks
not done
tags include #waiting
description includes Carla Mendes
short mode
```

