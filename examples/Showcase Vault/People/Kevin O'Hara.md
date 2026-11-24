---
type: person
role: GIS Analyst (LRS)
org: Planning Division
email: 
phone: 
---
# Kevin O'Hara

## Notes
- Owns the LRS. Ask him before assuming a route ID is bad.

## Meetings with Kevin O'Hara
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

## 👤 Kevin O'Hara is waiting on me
```tasks
not done
description includes 👤 [[Kevin O'Hara]]
sort by due
short mode
```
**Recently done for Kevin O'Hara** (let them know!)
```tasks
description includes 👤 [[Kevin O'Hara]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Kevin O'Hara is waiting on
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

## Requirements Kevin O'Hara was involved in
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

## Things I'm waiting on from Kevin O'Hara
```tasks
not done
tags include #waiting
description includes Kevin O'Hara
short mode
```

