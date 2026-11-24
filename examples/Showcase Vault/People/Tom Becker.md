---
type: person
role: Information Security Officer
org: IT Security
email: 
phone: 
---
# Tom Becker

## Notes
- Approves IdP changes and retention rules. Needs 2 weeks' notice for prod IdP changes.

## Meetings with Tom Becker
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

## 👤 Tom Becker is waiting on me
```tasks
not done
description includes 👤 [[Tom Becker]]
sort by due
short mode
```
**Recently done for Tom Becker** (let them know!)
```tasks
description includes 👤 [[Tom Becker]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Tom Becker is waiting on
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

## Requirements Tom Becker was involved in
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

## Things I'm waiting on from Tom Becker
```tasks
not done
tags include #waiting
description includes Tom Becker
short mode
```

