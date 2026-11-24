// Templater user script: tp.user.categoryHub("Category", "YYYY-MM-DD") → content of a category hub note.
// Lists every project/operations hub whose `category` includes this category
// (works for projects stored in other categories' folders too).
function categoryHub(cat, today) {
  const F = "```";
  return `---
type: category
created: ${today}
---
# ${cat}

## ⚙️ Operations (ongoing work)
${F}base
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
${F}

## 📁 Projects
${F}base
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
${F}

## 📚 Related knowledge
${F}base
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
${F}

## Notes
- 
`;
}
module.exports = categoryHub;
