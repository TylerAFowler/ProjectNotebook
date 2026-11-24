---
type: person
role: Data Scientist
org: IT Applications
email: 
phone: 
---
# Nina Shah

## Notes
- RoadView sign / guardrail detection models.

## Meetings with Nina Shah
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

## 👤 Nina Shah is waiting on me
```tasks
not done
description includes 👤 [[Nina Shah]]
sort by due
short mode
```
**Recently done for Nina Shah** (let them know!)
```tasks
description includes 👤 [[Nina Shah]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Nina Shah is waiting on
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

## Requirements Nina Shah was involved in
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

## Things I'm waiting on from Nina Shah
```tasks
not done
tags include #waiting
description includes Nina Shah
short mode
```

