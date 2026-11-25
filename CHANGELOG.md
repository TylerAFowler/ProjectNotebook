# Changelog

Update with `tools\update.ps1`, then run **Upgrade vault** (Ctrl+P → `Project Notes: Upgrade vault`).
Anything else you have to do by hand is listed under **Manual steps**.

## 1.1.0 (2026-11-25)
- New: **Project Notes** plugin (ships with the vault): clean commands (`Project Notes: New meeting`, `… Quick capture`…),
  a ☰ menu of every action in the left ribbon, and **buttons** at the top of Home, hubs, category hubs, meetings,
  requirements, daily notes, Git Activity and the Knowledge Base. Works in Reading view.
- Plugins ship with the vault, pre-configured: Templater, Tasks (click cycles to do → in progress → done; created date
  on), Homepage (opens 00 Home). Turn on community plugins once; update them inside Obsidian as usual.
- Property types (`.obsidian/types.json`): date pickers for `found`, `fixed`, `date`, `started`, `last_reviewed`…
  so they can be changed in the Properties panel without Editing view.
- Recommended hotkeys preset (Alt+Q, Alt+M, Alt+I, Alt+D, Alt+G…): `tools\update.ps1 -InstallHotkeys`. Never
  overwrites keys you've set.
- **Friction log** note + `Project Notes: Log friction` (Alt+F).
- Commands and hotkeys: rewritten for the new commands; new *Changing a task's status* section.
- Showcase: hands-on **Tutorials**.
- Templater's own template commands are no longer listed (Project Notes replaces them); Alt+E still works.

**Manual steps:** run **Upgrade vault** once (adds the buttons to existing hubs). Turn on the **Project Notes** plugin
if the update script added it (Settings → Community plugins). Optional: `-InstallHotkeys`.

## 1.0.1 (2026-11-25)
- Fix: everything below the 🧾 Git heading showed as raw text in edit mode (Live Preview). The Git hint's
  `<branch>/<folder>` was read as unclosed HTML. New hubs are fixed; **Upgrade Vault** repairs existing ones.
- Removed: the 📌 Sticky note, its CSS snippet and Quick Capture's *Sticky to-do* option. Your own `📌 Sticky.md`
  isn't deleted (it may hold to-dos); delete it yourself, and switch off the `sticky` snippet.
- New: `task-status` CSS snippet: in progress = half box, done = ✓ struck through, cancelled = grey ✗, faded
  (before, all three showed a ✓). Turn it on under Appearance → CSS snippets.
- New: **📜 History** box at the bottom of each Tasks note: click to show done and cancelled tasks in Reading view.
  Upgrade Vault adds it to existing Tasks notes.
- Commands and hotkeys: how to type the task symbols.
- New: **Upgrade Vault** template: repairs notes made by older versions; safe to run any number of times.

**Manual steps:** run Upgrade Vault once.

## 1.0.0 (2026-11-24)
First published version.
- Categories, projects (can span categories), operations hubs, category hubs
- Tasks with due dates, estimated completion (`🎯`), people waiting (`👤`), Git branches (`🌿`), recurring jobs, requests, waiting-on
- Meetings (past and future), known issues with people to notify, notes, FAQ, documents and links tables
- Requirements with IDs and version history linked to meetings and people
- Knowledge Base (runbooks and write-ups) incl. **Commands and hotkeys**
- GitHub / GitHub Enterprise integration: hub Git sections, daily commits, Git Activity page
- Weekly review incl. 📣 Let people know, FY quarters, commits by branch
- 📌 Sticky note for a pop-out window
- Home: quick-actions box removed (see Knowledge Base → Commands and hotkeys)
- Showcase vault + demo git history; template tests + GitHub Actions

**Manual steps** (only if you used a pre-release copy): none required. Notes made before 👤/`notify` existed keep working.
