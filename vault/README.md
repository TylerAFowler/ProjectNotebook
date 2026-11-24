# Project Notes Vault: setup & how to use

A starter Obsidian vault for juggling multiple projects:
**Category → Project → (hub, tasks, meetings, issues, notes, FAQ)**, plus a Home dashboard,
a daily work log and a one-click **"What did I do this week?"** report.

---

## 1. Setup (about 10 minutes)

1. Copy this whole `ObsidianVault` folder to your PC (put it where your sync tool will pick it up; see §5).
2. Install Obsidian (https://obsidian.md) → **Open folder as vault** → pick this folder.
3. **Settings → Community plugins → Turn on community plugins**, then **Browse** and install + enable:
   - **Templater**: runs the templates and scripts (already configured: `_Templates`, `_Scripts`)
   - **Tasks**: due dates, priorities, done dates and the task queries
   - **Homepage** *(optional)*: Settings → Homepage → set it to `00 Home`
4. Check **Settings → Core plugins** has **Bases** and **Daily notes** turned on (they're on by default).
   Daily notes is pre-set to folder `Daily`, format `YYYY-MM-DD`, template `_Templates/Daily Note`.
5. **Settings → Appearance → CSS snippets**: make sure `hide-done` is on.
6. **Settings → Hotkeys** and search "Templater". Suggested bindings:

   | Action | Command | Suggested key |
   |---|---|---|
   | Quick Capture | Templater: Insert `_Templates/Quick Capture.md` | Ctrl+Shift+T |
   | New meeting | Templater: Create `_Templates/Meeting.md` | Ctrl+Shift+M |
   | New issue | Templater: Create `_Templates/Issue.md` | Ctrl+Shift+I (replaces the developer-tools shortcut) |
   | Today's daily note | Daily notes: Open today's daily note | Ctrl+Shift+D |
   | Weekly report | Templater: Create `_Templates/Weekly Report.md` | Ctrl+Shift+W |
   | Refresh Git (hub or daily note) | Templater: Insert `_Templates/Refresh Git.md` | Ctrl+Shift+G |
   | New requirement / change one | Templater: Create `_Templates/Requirement.md` / Insert `Change Requirement.md` | (optional) |
   | New runbook / write-up | Templater: Create `_Templates/Runbook.md` / `Write-up.md` | (optional) |
   | New project / operations hub / category | Templater: Create `_Templates/New Project.md` / `New Operations.md` / `Category Hub.md` | (optional) |

   *If a "Create …" command is missing, go to Templater settings → Template hotkeys and add the template.*
   The full list of commands, with a column for the hotkeys you choose, is in **Knowledge Base → [[Commands and hotkeys]]**.

7. Want to see it full of realistic data first? Open the **Showcase Vault** from the repo's `examples/` folder
   as a separate vault (Obsidian → Open folder as vault) and start with **▶ Start here**.

---

## 2. Structure

### Projects vs. Operations vs. Categories
- **Category**: a system or area you own (Crash Database, Dashcam, OCI). Folder + hub note listing its operations and projects.
- **Project**: has a goal and an end. When finished, set `status: done` (it leaves Home but stays searchable).
- **Operations hub** (`New Operations` template): the ongoing, never-finished work for an area: **recurring jobs**
  (`🔁 every month on the 1st`), **requests** (`#request`), **runbooks** (how to do each routine job),
  an optional **deliverables schedule**, plus the usual docs/links/commands/issues/meetings.
- **Spanning categories**: when creating a project, pick the *main* category (its folder), then add any others
  (e.g. Dashcam Backend: main = Dashcam, also = OCI). It shows on every one of those category hubs.
  To add one later, add another line to the hub's `category` property.
- **Knowledge Base** (top-level folder): your own **Runbooks** and **Write-ups** that are useful across projects
  (e.g. test IdP setup, how WVDOT.saml2 works). Create with the `Write-up` template, or `Runbook` → "📚 Knowledge Base".
  Set a note's `related` property to projects/categories and it appears on their hubs under **📚 Related knowledge**.
  Each has its own documents/links tables (Quick Capture → Document/Link → "📘 This note" while it's open).
  Runbooks for a single area still go in that area's `Runbooks/` folder. `last_reviewed` + the index's
  "Needs review" view flag guides not checked in 6+ months.
- Every note name must be unique (Obsidian links by name). Don't name a project the same as its category.


```
00 Home.md                         Dashboard: active projects + next actions, overdue, waiting-on, issues
General Docs & Links.md            Useful docs/URLs not tied to a project (name, topic, purpose, location)
Knowledge Base/                    Knowledge Base.md (index) · Runbooks/ · Write-ups/
<Category>/
  <Category>.md                    Category hub: its operations + projects (incl. ones from other folders)
  <Category> Operations/           Ongoing-work hub (+ Runbooks/ folder)
  <Project>/
    <Project>.md                   ★ Project hub: open this when you switch to a project
    <Project> - Tasks.md           All tasks ever (completed ones hidden in Reading view)
    <Project> - FAQ.md             Optional: questions people ask you, as collapsible answers
    Meetings/YYYY-MM-DD Title.md
    Requirements/<ID> <Title>.md   One note per requirement, with version history
    Issues/<Title>.md              Known issues: status, severity, workaround, fix
    Notes/<Title>.md               Longer write-ups, runbooks, how-tos
People/<Name>.md                   Auto-lists every meeting they attended
Daily/YYYY-MM-DD.md                Your work log (feeds the weekly report)
Weekly/YYYY-Www Weekly Report.md   Generated reports
_Templates/  _Scripts/             Templater templates + scripts (don't put notes here)
```

### The project hub has
| Section | Purpose |
|---|---|
| 🧭 **Where I left off** + `next_action` property | Update when you switch away. `next_action` shows on Home for every project |
| ⏳ **Waiting on** | Open `#waiting` tasks, with follow-up dates (they also appear on Home) |
| 📋 **Open tasks** | Every open task in the project folder (Tasks note *and* meeting action items) |
| ⚠️ **Things to be aware of** | Gotchas |
| ✅ **Decisions** | `- YYYY-MM-DD — decision — why` |
| 💻 **Helpful commands** | |
| 📄 **Relevant documents** | Table: document · one-line what/why · location (path, share or URL) |
| 🌐 **Useful links** | Table: link · one-line what/why · URL |
| 🖥️ **Environments**, 👥 **People** | |
| 🐞 Issues / 🗓️ Meetings / 📝 Notes | Live tables (Bases) of this project's notes |

Set `status:` to `active`, `on-hold` or `done` in the hub's properties. Only `active` projects show on Home.

---

## 3. Day-to-day workflow

- **Switching projects:** open the hub → read *Where I left off* → work → update *Where I left off* and `next_action` before you leave.
- **Capture anything fast:** Quick Capture hotkey → pick project (the one you're in is listed first) → pick
  *Task (one-off or recurring) / Request / Waiting on / Decision / Thing to be aware of / Helpful command / FAQ entry /
  Document / Link / Deliverable*. It writes into
  the right note without leaving the one you're in. For Document and Link you can also pick
  **📚 General Docs & Links** instead of a project.
- **Tasks:** `- [ ] Do the thing 📅 2026-12-05 ⏫`. Use the Tasks command *"Create or edit task"* for a date-picker form.
  - `[ ]` todo · `[/]` in progress · `[x]` done (Tasks adds `✅ date` automatically) · `[-]` cancelled
  - Done tasks stay in the file as history but vanish from the hub, Home, and the Tasks note in Reading view.
    Press Ctrl/Cmd+E on the Tasks note to see the full history.
- **People waiting on a task:** add `👤 [[Person]]` (one per person) for whoever is waiting on it or should be told
  when it's done, e.g. `- [ ] Send 2025 extract 👤 [[Bob Smith]] 📅 2026-12-05`. Quick Capture asks for it.
  Issues have a `notify` property for the same purpose (the Issue template asks).
  These show on each person's note (*waiting on me*, *recently done for them*, *issues they're waiting on*), on Home
  (**👤 Others waiting on me**), and in the weekly review's **📣 Let people know** section.
- **Meetings:** new meeting → pick project, title, date, attendees. Action items written as tasks roll up to the hub automatically.
- **Daily log:** open today's daily note and add one bullet per thing you did, starting with the project link:
  `- [[Example Project]] fixed the null-route geocoding bug`.

---

## 3b. Requirements

Each requirement is its own note in the project's `Requirements/` folder, e.g. `EP-REQ-001 County codes validated`
(prefix = project initials; set a `req_prefix` property on the hub to choose your own).

- **New:** Ctrl+P → `Templater: Create _Templates/Requirement.md` → project, title, wording, priority
  (must / should / could / won't), status, the meeting it came from, who asked.
- **Changed:** Ctrl+P → `Templater: Insert _Templates/Change Requirement.md`. Pick what changed (wording, status,
  priority), why, the meeting and people. It bumps the **version**, updates the wording, and adds a row to the
  note's **Version history** table (old → new wording, status/priority changes, why, meeting, who).
- **Run either one from inside a meeting note** and that meeting is selected first with its attendees as "who".
  The requirement's date is the meeting's date.
- Statuses: proposed → approved → implemented (or deferred / dropped).
- Shows up on: the project hub (**📐 Requirements**: Active / Changed in last 30 days / All), each meeting
  (**Requirements discussed**), each person's note, and the weekly review (**📐 Requirements added / changed**).

---

## 3c. 📌 Sticky note (always-visible to-dos)

`📌 Sticky.md` (top of the vault) shows: your quick general to-dos, everything **due today / overdue**, and any
project task tagged **`#sticky`**. Ticking a box there ticks the real task.
- Add a general to-do: **Quick Capture → 📌 Sticky to-do** (no project needed). Pin a project task: add `#sticky` to it.
- Keep it on screen: open it → right-click its tab → **Open in new window** → shrink the window and park it.
  Minimize the main Obsidian window and the sticky stays.
- Always on top of other apps: Obsidian can't do this itself; if your PC allows **Microsoft PowerToys**,
  its *Always On Top* (**Win+Ctrl+T**) pins the sticky window.
- Make more stickies: copy `📌 Sticky.md` (keep the `sticky` cssclass) and change its lists.
- Style: `.obsidian/snippets/sticky.css` (turn on under Settings → Appearance → CSS snippets).

---

## 4. Weekly review (for the division report)

Run **Weekly Report** → *This week / Last week / Pick a date*. It creates `Weekly/2026-W48 Weekly Report.md`:
a review page of **everything that might be worth putting in the division's weekly report**, grouped by project:

- ✅ **Completed** tasks: `Load 2025 crash records — Completed 11/23`
- 🔄 **In progress** tasks: `Add SSO login — Estimated Completion FY2027 Q2`
- 📣 **Let people know**: per person, what was completed/fixed for them this week
- 📐 Requirements added / changed · 🐞 Issues found / 🔧 fixed · 🗓️ meetings held · ✅ decisions logged
- 🧾 **Commits on every branch** (grouped by branch) and **PRs opened/merged**; everyone's, ★ = yours
- 📝 your daily-log bullets
- ⏭️ **Coming up next week**: tasks due/estimated, scheduled meetings, waiting-on follow-ups

**Estimated completion** is its own task field: `🎯 2026-12-15` (or `🎯 FY2027 Q2`). Quick Capture asks for it.
The report shows it as a state fiscal quarter (FY runs Jul–Jun, named for the year it ends; change
`FY_START_MONTH` in `_Scripts/weeklyReport.js` if needed). No 🎯? It falls back to the due date (📅), then ⏳.

To refresh, delete the note and run it again. Daily-log bullets and ✅ dates matter most.

---

## 4b. GitHub: branches & commits

**Setup per project:** put the repo URL(s) in the hub's `repo` property (a list, so several repos are fine).
- `https://github.com/owner/repo`: the whole repo
- `https://github.com/owner/repo/tree/main/backend`: only commits touching `backend/` (shared/mono repos like Dashcam)
- GitHub Enterprise works too: `https://github.<company>/owner/repo` (Server) or `*.ghe.com` (Cloud)

**Link tasks to branches:** add `🌿 branch-name` to the task (Quick Capture asks for an optional branch), e.g.
`- [ ] Add SSO login 🌿 feature/sso-login 📅 2026-12-05`

**Refresh:** bind `Templater: Insert _Templates/Refresh Git.md` to **Ctrl+Shift+G**, then press it while in:
- the **[[Git Activity]]** page → every commit on every branch of every project's repos in the last 7 days,
  grouped by project → repo → branch, plus PRs opened/merged (★ = yours).
- a **project / operations hub** (or any note inside one) → the hub's **🧾 Git** section shows task branches
  (ahead/behind, last commit, PR), each task branch's commits, open PRs, other branches, and recent commits.
- a **daily note** → **🧾 Commits** lists *your* commits that day across all projects (default branch, task branches,
  and branches of your open PRs). It's also filled when the daily note is created. The weekly review includes commits too (all branches).

**Tokens (asked once per host, per computer; stored in Obsidian's local storage, never in a note or synced):**
- github.com → Settings → Developer settings → Personal access tokens → **Fine-grained** → pick the repos →
  Repository permissions: **Contents: Read**, **Pull requests: Read** (Metadata: Read is automatic).
  If the org uses SSO: on the token page, **Configure SSO → Authorize** for that org.
- GitHub Enterprise Server: same place on your company's GitHub. If fine-grained tokens aren't available,
  use a classic token with the `repo` scope. You may need to be on the VPN.
- Public repos work without a token (leave it blank), limited to 60 requests/hour.
- Token expired or wrong? It's forgotten automatically on a 401, or run `Templater: Insert _Templates/Git Forget Tokens.md`.

Everything is read-only: nothing is ever written to GitHub.

---

## 5. Syncing between devices (Google Drive)

1. Install **Google Drive for desktop** and sign in. It starts with Windows and syncs in the background.
2. Drive settings (gear → Preferences → Google Drive) → choose **Mirror files** (*not* Stream files).
   Obsidian needs real local copies of every note; streaming makes it slow or shows missing notes.
3. Keep the vault inside `My Drive` (e.g. `My Drive\ObsidianVault`).
4. On another PC: install Drive (Mirror mode), let it finish syncing, then Obsidian → **Open folder as vault** → same folder.

Tips: give Drive a few seconds after editing before switching machines, and don't edit the same note on two
machines at once (Drive would keep both copies as `Note (1).md`). Phone access isn't supported by Google Drive;
Obsidian Sync (~$4/mo) is the easy option if you ever need it. Check that work notes are allowed in your Google Drive.

---

## 6. Customizing

- **Hub layout for new projects:** edit `_Templates/New Project.md` (the text after `tR += \``).
- **Weekly report contents:** `_Scripts/weeklyReport.js`.
- **Quick Capture options:** `_Templates/Quick Capture.md`.
- Existing hubs aren't changed when you edit templates; copy sections across by hand.
