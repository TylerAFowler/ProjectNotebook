---
type: writeup
kind: procedure
topic: "This vault"
related: []
created: 2026-11-24
last_reviewed: 2026-11-24
---
# Commands and hotkeys
**📚 Knowledge Base** · procedure · *How to drive this vault from the keyboard.*

> [!summary] TL;DR
> - **Buttons** at the top of Home, hubs, meetings and requirements do the common things. No shortcuts needed.
> - **All actions:** the ☰ icon in the left ribbon, or **Ctrl/Cmd+P** and type `project notes` (or just `meeting`, `issue`…).
> - **Hotkeys are optional.** The repo's update script can install the *preset* keys below
>   (`tools\update.ps1 -InstallHotkeys`; it never overwrites a key you've set). Or bind your own:
>   **Settings → Hotkeys**, search the command, click ⊕, press the keys, and note it in **My hotkey**.

## This vault's commands (Project Notes plugin)
| What | Command (Ctrl+P → type a few letters) | What it does | Preset key | My hotkey |
| ---- | ---- | ---- | ---- | ---- |
| Quick capture | Project Notes: Quick capture | Task, request, waiting-on, decision, gotcha, command, FAQ, doc, link or deliverable, written into the right project | Alt+Q | |
| Show all actions | Project Notes: Show all actions | Menu of everything below (also the ☰ icon in the left ribbon) | Alt+A | |
| New meeting | Project Notes: New meeting | Meeting note (past or future) in a project's Meetings folder | Alt+M | |
| New issue | Project Notes: New issue | Known issue with severity and people to notify | Alt+I | |
| New note | Project Notes: New note | Free-form note inside a project | Alt+N | |
| Edit task under cursor | Project Notes: Edit task under cursor | Form to change a task's status, dates, priority (Editing view; in task lists use the ✏️ pencil) | Alt+T | |
| Log friction | Project Notes: Log friction | One line about something that got in your way → Friction log | Alt+F | |
| Open today's daily note | Project Notes: Open today's daily note | Daily log, commits, done/due today | Alt+D | |
| Open Home | Project Notes: Open Home | The dashboard | Alt+H | |
| Weekly review | Project Notes: Weekly review | Everything from a week to pick from for the division report | Alt+W | |
| Refresh Git | Project Notes: Refresh Git | Updates the 🧾 Git section of the hub, daily note or Git Activity page you're on | Alt+G | |
| New requirement | Project Notes: New requirement | Requirement with ID and version history (run from a meeting to link it) |  | |
| Change requirement | Project Notes: Change requirement | New version of a requirement: what changed, why, which meeting, who |  | |
| New person | Project Notes: New person | Person note: their meetings, what they're waiting on, their issues |  | |
| New runbook | Project Notes: New runbook | Step-by-step for a routine job (area or Knowledge Base) |  | |
| New write-up | Project Notes: New write-up | Knowledge Base article: setup, how it works, policy, retrospective |  | |
| New project | Project Notes: New project | Project folder, hub, tasks note, optional FAQ |  | |
| New operations area | Project Notes: New operations area | Ongoing area: recurring jobs, requests, runbooks |  | |
| New category | Project Notes: New category | Category hub listing its operations and projects |  | |
| Open Git Activity / Knowledge Base / Docs & Links / this help | Project Notes: Open … | Jump to those pages |  | |
| Upgrade vault | Project Notes: Upgrade vault | Repairs notes made by older versions; run after each update (safe to repeat) |  | |
| Forget saved Git tokens | Project Notes: Forget saved Git tokens | Removes saved GitHub tokens from this computer |  | |

*Buttons: put a code block like this in any note to get buttons for those actions:*
````
```actions
quick-capture new-meeting new-issue refresh-git
```
````
*Action names: `quick-capture` `new-meeting` `new-issue` `new-note` `new-requirement` `change-requirement` `new-person`
`new-runbook` `new-write-up` `new-project` `new-operations` `new-category` `weekly-review` `refresh-git` `edit-task`
`log-friction` `open-home` `open-today` `open-git-activity` `open-knowledge-base` `open-docs-links` `open-help`
`upgrade-vault` `forget-git-tokens`.*

## Changing a task's status
| You want to… | In Reading view (and task lists) | In Editing view |
| --- | --- | --- |
| Start / finish a task | Click the box: to do → in progress (◐) → done (✓) → to do | Same |
| Cancel a task | ✏️ pencil next to the task in any task list → **Status: Cancelled** | Cursor on the task → **Edit task** (Alt+T) → Status |
| Reopen a done/cancelled task | 📜 History box on the Tasks note → ✏️ pencil → Status: Todo | Edit task, or change `[x]`/`[-]` to `[ ]` |
| Change due date, priority… | ✏️ pencil | Edit task |
*The form and clicks add the ✅ done / ❌ cancelled date for you. Typing `[x]` or `[-]` by hand doesn't.*

## Obsidian & plugin commands worth a key
| What | Command (Ctrl+P) | Default key | My hotkey |
| ---- | ---------------- | ----------- | --------- |
| Today's daily note | Daily notes: Open today's daily note | | |
| Jump to any note | Quick switcher: Open quick switcher | Ctrl+O | |
| Search everything | Search: Search in all files | Ctrl+Shift+F | |
| Reading ↔ editing view (shows hidden done tasks) | Toggle reading view | Ctrl+E | |
| Back / forward | Navigate back / forward | Ctrl+Alt+← / → | |
| Tick a checkbox | Toggle checkbox status | Ctrl+Enter | |
| Task with a date picker | Tasks: Create or edit task | | |
| Command palette | Command palette: Open command palette | Ctrl+P | |
| Go to Home | *(Homepage plugin)* Homepage: Open homepage | | |

## Markers cheat sheet
| Write | Means |
| ----- | ----- |
| `[ ]` `[/]` `[x]` `[-]` | to do · in progress (half box) · done (✓) · cancelled (✗, faded). Needs the `task-status` CSS snippet |
| `📅 2026-12-05` | due date |
| `⏳ 2026-12-01` | scheduled (when you plan to work on it) |
| `🎯 FY2027 Q2` or `🎯 2026-12-11` | estimated completion (weekly review shows it) |
| `👤 [[Person]]` | someone waiting on it / to tell when done |
| `🌿 feature/branch` | the Git branch for this task |
| `🔁 every month on the 1st` | recurring |
| `⏫` `🔼` `🔽` | high · medium · low priority |
| `#request` `#waiting` | someone asked · waiting on someone |

## Typing the symbols
You rarely need to type them yourself:
- **Quick Capture** asks questions and writes every marker for you (📅 🎯 👤 🌿 🔁 priority).
- **Tasks: Create or edit task** (Ctrl+P; worth a hotkey): a form with date pickers, priority, recurrence and status.
  Run it with the cursor on an existing task to edit it.
- **Tasks auto-suggest**: while typing a task line, type `due`, `scheduled`, `every`, `high`… and pick from the menu
  (e.g. `due tomorrow` → `📅 2026-11-26`). Settings → Tasks → *Auto-suggest* must be on.
- **Windows emoji picker** for the rest: **Win + .** then search `target` (🎯), `bust` (👤), `herb` (🌿).
- Or copy one from this table.

Only add the markers you need. A plain `- [ ] Call Priya` is fine; each marker exists because something reads it:
📅 → due/overdue lists · 🎯 → weekly review's estimated completion · 👤 → the person's page, Home and "Let people know" ·
🌿 → the hub's Git section.

## My notes
- 

## 📄 Relevant documents
| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
|          |                              |          |

## 🌐 Useful links
| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
| Obsidian hotkeys help | How hotkeys work | https://help.obsidian.md/User+interface/Hotkeys |
| Tasks plugin docs | Every task marker and query option | https://publish.obsidian.md/tasks/Introduction |

## Change log
- 2026-11-24 — created
