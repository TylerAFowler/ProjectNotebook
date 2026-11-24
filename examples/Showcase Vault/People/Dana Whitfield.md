---
type: person
role: Traffic Safety Engineer
org: Traffic Safety Division
email: 
phone: 
---
# Dana Whitfield

## Notes
- Heaviest dashboard user (HSIP analysis). Good tester; very fast feedback.

## Meetings with Dana Whitfield
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

## 👤 Dana Whitfield is waiting on me
```tasks
not done
description includes 👤 [[Dana Whitfield]]
sort by due
short mode
```
**Recently done for Dana Whitfield** (let them know!)
```tasks
description includes 👤 [[Dana Whitfield]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Dana Whitfield is waiting on
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

## Requirements Dana Whitfield was involved in
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

## Things I'm waiting on from Dana Whitfield
```tasks
not done
tags include #waiting
description includes Dana Whitfield
short mode
```

