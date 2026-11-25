---
type: index
---
# 📚 Knowledge Base
```actions
new-write-up new-runbook log-friction
```
Your own runbooks and write-ups that are useful **across** projects (procedures, setup guides, policies, how systems work).
- New: the **Write-up** or **Runbook** button above (for a runbook, pick **📚 Knowledge Base**).
- Set `related` on a note to show it on those project/category hubs (under **📚 Related knowledge**).
- Pointers to external docs/URLs live in [[General Docs & Links]].

## 📘 Runbooks
```base
filters:
  and:
    - type == "runbook"
views:
  - type: table
    name: Knowledge Base runbooks
    filters:
      and:
        - file.inFolder("Knowledge Base")
    groupBy:
      property: note.topic
      direction: ASC
    order:
      - file.name
      - note.frequency
      - note.related
      - note.last_run
      - note.last_reviewed
  - type: table
    name: All runbooks (incl. area ones)
    order:
      - file.name
      - note.project
      - note.topic
      - note.frequency
      - note.last_run
```

## 📝 Write-ups
```base
filters:
  and:
    - type == "writeup"
views:
  - type: table
    name: By topic
    groupBy:
      property: note.topic
      direction: ASC
    order:
      - file.name
      - note.kind
      - note.related
      - note.last_reviewed
  - type: table
    name: By kind
    groupBy:
      property: note.kind
      direction: ASC
    order:
      - file.name
      - note.topic
      - note.related
      - note.last_reviewed
```

## 🕰️ Needs review (not checked in 6+ months)
```base
filters:
  and:
    - file.inFolder("Knowledge Base")
    - or:
        - type == "runbook"
        - type == "writeup"
    - last_reviewed < today() - "6M"
views:
  - type: table
    name: Needs review
    order:
      - file.name
      - note.type
      - note.topic
      - note.last_reviewed
    sort:
      - property: note.last_reviewed
        direction: ASC
```
