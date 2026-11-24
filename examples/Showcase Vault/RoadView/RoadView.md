---
type: category
created: 2026-11-24
---
# RoadView

## ⚙️ Operations (ongoing work)
```base
filters:
  and:
    - type == "project"
    - kind == "operations"
    - list(category).contains(this)
views:
  - type: table
    name: Operations
    order:
      - file.name
      - note.category
      - file.mtime
```

## 📁 Projects
```base
filters:
  and:
    - type == "project"
    - kind != "operations"
    - list(category).contains(this)
views:
  - type: table
    name: Active
    filters:
      and:
        - 'status != "done"'
    order:
      - file.name
      - note.status
      - note.next_action
      - note.category
      - file.mtime
    sort:
      - property: file.mtime
        direction: DESC
  - type: table
    name: Done
    filters:
      and:
        - 'status == "done"'
    order:
      - file.name
      - note.category
      - file.mtime
```

## 📚 Related knowledge
```base
filters:
  and:
    - list(related).contains(this)
views:
  - type: table
    name: Related knowledge
    order:
      - file.name
      - note.type
      - note.topic
      - note.last_reviewed
```

## Notes
- 
