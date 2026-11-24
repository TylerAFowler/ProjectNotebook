# Obsidian Notes Template

An Obsidian vault for keeping track of many projects at once: where you left off, tasks, people waiting on you,
meetings, requirements with version history, known issues, runbooks, a knowledge base, GitHub commits per project,
and a weekly review that collects everything you did.

| Folder | What |
| ------ | ---- |
| `vault/` | **The template.** Copy it to start a new vault, or update an existing vault from it. |
| `examples/Showcase Vault/` | The same vault, filled with a fictional team's projects. Open it to see everything working. |
| `examples/ObsidianNotesDemo.bundle` | Fake git history (5 developers, 9 branches) behind the showcase's Git sections. |
| `tools/update.ps1` | Updates your vault from `vault/` **without touching your notes**. |
| `tools/make-demo-code.py` | Rebuilds the demo git history. |
| `tests/` | Runs every template against a mock of Obsidian (`npm test`). GitHub Actions runs it on each push. |

Needs Obsidian 1.9+ (Bases) and the community plugins **Templater**, **Tasks** and **Homepage**.

## Start a new vault
1. Copy the `vault` folder to where your vault should live (e.g. `G:\My Drive\ObsidianVault`).
2. Obsidian → **Open folder as vault** → pick that folder.
3. Follow the **README** inside the vault (turn on the plugins, CSS snippets and hotkeys).

## See the showcase
Open `examples/Showcase Vault` as a separate vault (Obsidian → *Open folder as vault*), turn on the community
plugins when asked, and open **▶ Start here**.

Optional, so that **Refresh Git** works live in the showcase: push the demo history to an empty GitHub repo
named `ObsidianNotesDemo` (no README):
```powershell
git clone --mirror examples\ObsidianNotesDemo.bundle $env:TEMP\ObsidianNotesDemo.git
git -C $env:TEMP\ObsidianNotesDemo.git push --mirror https://github.com/<you>/ObsidianNotesDemo.git
```
The showcase's links point at `github.com/TylerAFowler/ObsidianNotesDemo`. For another account, rebuild it with
`DEMO_REPO_URL=https://github.com/<you>/ObsidianNotesDemo npm run showcase` (in `tests/`).

## Update an existing vault
```powershell
cd <where you cloned this repo>
.\tools\update.ps1 -WhatIf      # preview
.\tools\update.ps1              # git pull, then update G:\My Drive\ObsidianVault (or -Vault "<path>")
```
| Kind | Examples | On update |
| ---- | -------- | --------- |
| Framework | `_Templates/`, `_Scripts/`, CSS snippets, `00 Home.md`, `README.md`, `Knowledge Base.md` | Replaced when different (old copy backed up to `%LOCALAPPDATA%\ObsidianNotesTemplate\backup`) |
| Starter | `📌 Sticky.md`, `General Docs & Links.md`, `Git Activity.md`, `Commands and hotkeys.md` | Added only if missing |
| Your notes | categories, projects, People, Daily, Weekly, Knowledge Base notes | Never touched |
| Settings | plugins list, CSS snippets, Templater command list | Only missing entries are added; hotkeys and theme untouched |

Run it on one computer. Google Drive (or whatever syncs the vault) carries the changes to the others.
Keep the clone of this repo **outside** the synced folder. Templates you add yourself in `_Templates` are kept,
but don't edit the repo's own templates in place: the next update replaces them (the old copy is in the backup).

## Rules for changes (so updates never break existing notes)
- Never rename or remove a property, marker (`👤 🎯 🌿 📅`), heading or table column that existing notes use. Add new ones instead.
- Scripts must cope with notes that lack anything new.
- When old notes need new structure, ship a re-runnable upgrade step and note it in `CHANGELOG.md`.
- `npm test` (in `tests/`) must pass. It runs 170+ template runs, including building the whole showcase.

## Development
```bash
cd tests
npm ci
npm test                # all tests against fresh copies of vault/
npm run showcase        # rebuild examples/Showcase Vault + the demo bundle (needs git and python3)
```
The tests freeze the clock at Tue 24 Nov 2026 so results are reproducible (`FAKE_NOW` to change it).
