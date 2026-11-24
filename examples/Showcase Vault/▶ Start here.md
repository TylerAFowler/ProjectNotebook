# ▶ Start here: a 15-minute tour

This vault belongs to a fictional developer, **Alex Rivera**, on a transportation agency's IT team.
Everything in it was made with the vault's own templates. All people, systems and URLs are invented.

> [!note] Dates
> The content was generated as of **Tuesday, Nov 24 2026**. Live lists such as *Overdue*, *Due this week* and
> *Upcoming meetings* use the real date, so they'll look different the further you are from that day.
> The weekly reviews, daily notes and Git sections are fixed snapshots.

## 1. The dashboard: [[00 Home]]
- **🧭 Active projects**: every project's `next_action`. Open one and its *Where I left off* box tells you how to pick up again.
- **Overdue / Due this week**: tasks from every project in one place.
- **👤 Others waiting on me** and **⏳ Waiting on others**: who's blocked on you, and who you're blocked on.
- **Open issues** and **Upcoming meetings** across all projects. The finished project (*Paper Crash Form Retirement*) is absent: `status: done` hides it.

## 2. A project hub: [[2025 Crash Data Load]]
- *Where I left off*, then **Waiting on**, **Open tasks**, **📐 Requirements**, **🧾 Git**, **📚 Related knowledge**,
  gotchas, decisions, commands, documents, links, environments, people, issues, meetings and notes.
- The **🧾 Git** section shows the branch linked to the in-progress task (`🌿 feature/county-validation`): how far ahead it is and its commits.
- **❓ FAQ** under the title holds answers you give other people over and over.
- Open [[2025 Crash Data Load - Tasks]]. Reading view hides finished tasks; press **Ctrl+E** to see the full history.

## 3. Requirements with history: [[CDL-REQ-001 County codes validated]]
- The **Version history** table shows each change: what changed, why, in which meeting, and who asked.
- Open [[2026-11-18 Validation rules review]]: the meeting lists the requirements it changed, and its action items roll up to the hub.

## 4. People: [[Marcus Bell]], [[Rita Gomez]]
- Each person's page shows their meetings, the tasks they're waiting on (`👤`), what was recently done for them, their issues and their requirements.

## 5. The weekly review: [[2026-W47 Weekly Report]]
- **📣 Let people know**: per person, what was finished or fixed for them that week.
- Per project: ✅ completed ("Completed 11/18"), 🔄 in progress ("Estimated Completion FY2027 Q2"), issues found and fixed,
  requirement changes, meetings, decisions, commits grouped by branch (★ = Alex's), the work log, and what's coming up next week.
- [[2026-W48 Weekly Report]] is the current, partial week.

## 6. Daily notes and Git
- [[2026-11-24]]: the log bullets (these feed the weekly review), Alex's commits that day, and tasks done or due.
- [[Git Activity]]: every branch and commit from the last 7 days, grouped by project.

## 7. Categories and operations
- [[RoadView]] and [[Cloud Platform]] are **category hubs**. *RoadView Backend* and *RoadView Inference* appear on both, because a project can belong to more than one category.
- [[Crash Records Operations]] is an **operations hub** for ongoing work: 🔁 recurring jobs, 📬 requests, a 📅 deliverables schedule and 📘 runbooks such as [[Monthly FHWA crash extract]].

## 8. Knowledge Base: [[Knowledge Base]]
- Write-ups and runbooks useful across projects, e.g. [[How the test IdP is set up]].
- A write-up's `related` property puts it under **📚 Related knowledge** on those hubs (see [[SSO Migration]]).
- [[Commands and hotkeys]] lists every command, with a column to record your own hotkeys.
- [[General Docs & Links]] holds pointers that aren't tied to a project.

## 9. 📌 Sticky
- Open [[📌 Sticky]], right-click its tab → **Open in new window**, shrink it and park it beside your other windows.

## 10. Try it live
| Try | How | Watch |
| --- | --- | ----- |
| Capture a task | On a hub, **Quick Capture** → Task. Add a due date, `🎯 FY2027 Q3`, a branch and a person | It appears in the hub's Open tasks, on Home, and on the person's page |
| Request from someone | Quick Capture → Request | Shows under *📬 Open requests* on an operations hub |
| New meeting | Create **Meeting**, pick a project, a future date, attendees | *Upcoming meetings* on Home and on the hub |
| Change a requirement | Open a meeting, then Insert **Change Requirement** | A new version row linked to that meeting and its attendees |
| Fix an issue | Set an issue's `status: fixed` and `fixed:` to a date this week, then create **Weekly Report** → This week | It appears under 🔧 Issues fixed and 📣 Let people know |
| Refresh Git | Needs the demo repo pushed to GitHub (see the repo README), then **Ctrl+Shift+G** on a hub | The 🧾 Git section updates from GitHub |
