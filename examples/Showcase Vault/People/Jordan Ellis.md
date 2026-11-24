---
type: person
role: Cloud Engineer
org: IT Infrastructure
email: 
phone: 
---
# Jordan Ellis

## Notes
- Tenancy, networking, Terraform. Firewall and quota requests go to Jordan.

## Meetings with Jordan Ellis
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

## 👤 Jordan Ellis is waiting on me
```tasks
not done
description includes 👤 [[Jordan Ellis]]
sort by due
short mode
```
**Recently done for Jordan Ellis** (let them know!)
```tasks
description includes 👤 [[Jordan Ellis]]
(done this month) OR (done last month)
sort by done reverse
short mode
```

## 🐞 Issues Jordan Ellis is waiting on
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

## Requirements Jordan Ellis was involved in
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

## Things I'm waiting on from Jordan Ellis
```tasks
not done
tags include #waiting
description includes Jordan Ellis
short mode
```

