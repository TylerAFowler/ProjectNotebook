---
type: project
kind: operations
category:
  - "[[Cloud Platform]]"
status: active
repo:
  - https://github.com/TylerAFowler/ObsidianNotesDemo/tree/main/infra/terraform
started: 2026-11-24
---
# Cloud Platform Operations
```actions
quick-capture new-meeting new-issue new-runbook refresh-git
```

> [!info] Ongoing work for [[Cloud Platform]]: recurring jobs, requests and how-tos. Projects are listed on the category page.

## 🔁 Recurring jobs  ·  [[Cloud Platform Operations - Tasks|full history]]
```tasks
not done
is recurring
path includes {{query.file.folder}}
sort by due
short mode
```

## 📬 Open requests
```tasks
not done
tags include #request
path includes {{query.file.folder}}
sort by due
short mode
```
**Recently delivered**
```tasks
tags include #request
(done this month) OR (done last month)
path includes {{query.file.folder}}
sort by done reverse
short mode
```

## ⏳ Waiting on
```tasks
not done
tags include #waiting
path includes {{query.file.folder}}
sort by due
short mode
```
*Quick Capture → "Waiting on", or write `- [ ] #waiting <thing> from [[Person]] 📅 <follow-up date>` in the Tasks note.*

## 📋 Other open tasks
```tasks
not done
is not recurring
tags do not include #waiting
tags do not include #request
path includes {{query.file.folder}}
sort by due
sort by priority
short mode
```

## 📘 Runbooks
*How to do each routine job. New: the **Runbook** button above (or Ctrl+P → Project Notes: New runbook).*
```base
filters:
  and:
    - type == "runbook"
    - project == this
views:
  - type: table
    name: Runbooks
    order:
      - file.name
      - note.frequency
      - note.last_run
```

## 🧾 Git
*Add repo URL(s) to the `repo` property (use a `/tree/branch/folder` URL to limit to a folder), then
press **Refresh Git** above. Link a task to a branch with `🌿 branch-name` in the task.*
<!-- git:start -->
*Refreshed 2026-11-24 16:00*

### [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `infra/terraform/` · default `main`

**🧾 Recent commits on `main`** touching `infra/terraform/`
- 11-23 [`add6304`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/add630439a07d70a6689e63d83693285e5dd1b2f) terraform: bump OCI provider to 6.12: jellis
- 11-09 [`c953dff`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/c953dffeafe81354504928606de599537e4d444b) terraform: lifecycle rule to archive clips after 90 days: jellis
- 10-05 [`6052b58`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/6052b58f7044274a72b6839e67aeaea8e46dfb59) infra/terraform: VCN, subnets and clip bucket: jellis
<!-- git:end -->

## 📚 Related knowledge
*Knowledge Base runbooks/write-ups whose `related` property includes this note.*
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

## ⚠️ Things to be aware of
- Never run `terraform apply` from a laptop. Plans are applied by the pipeline only.

## ✅ Decisions
*Format: `- YYYY-MM-DD — decision — why`.*
- 

## 💻 Helpful commands
*Quick Capture → Helpful command, or paste a code block here.*
- `terraform -chdir=infra/terraform plan -var-file=prod.tfvars`

## 📄 Relevant documents
*Quick Capture → Document. Location = file path, share/SharePoint path, or URL.*

| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
|          |                              |          |

## 🌐 Useful links
*Quick Capture → Link.*

| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
|      |                              |     |

## 🖥️ Environments
| What | Where |
| ---- | ----- |
| Dev  |       |
| Prod |       |
| Repo |       |

## 👥 People
- 

## 🐞 Open issues
```base
filters:
  and:
    - type == "issue"
    - project == this
views:
  - type: table
    name: Open
    filters:
      and:
        - 'status != "fixed"'
    order:
      - file.name
      - note.status
      - note.severity
      - note.notify
      - note.found
    sort:
      - property: note.found
        direction: DESC
  - type: table
    name: All
    order:
      - file.name
      - note.status
      - note.severity
      - note.found
      - note.fixed
```

## 🗓️ Meetings
```base
filters:
  and:
    - type == "meeting"
    - project == this
views:
  - type: table
    name: Upcoming
    filters:
      and:
        - date >= today()
    order:
      - file.name
      - note.date
      - note.time
      - note.attendees
    sort:
      - property: note.date
        direction: ASC
  - type: table
    name: Past
    filters:
      and:
        - date < today()
    order:
      - file.name
      - note.date
      - note.attendees
    sort:
      - property: note.date
        direction: DESC
```

## 📝 Notes
```base
filters:
  and:
    - project == this
    - or:
        - type == "note"
views:
  - type: table
    name: Notes
    order:
      - file.name
      - note.type
      - file.mtime
    sort:
      - property: file.mtime
        direction: DESC
```

