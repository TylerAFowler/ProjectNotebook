---
type: weekly
week_start: 2026-11-23
week_end: 2026-11-29
---
# Weekly review: Nov 23 – Nov 29, 2026

> Everything that might be worth putting in the division report. Pick what matters and copy it over.
>
> 3 tasks completed · 3 tasks in progress · 1 issue found / 1 fixed · 2 requirement changes · 2 meetings · 3 decisions · 6 projects with Git activity

## 📣 Let people know
*Done or fixed this week for people waiting on it.*

**[[Marcus Bell]]**
- ✅ Request: 2025 fatal crash counts by county — Completed 11/23 ([[Crash Records Operations]])
- ✅ Send Marcus 2025 fatal crash counts by county — Completed 11/23 ([[Crash Records Operations]])

**[[Sam Okafor]]**
- 🔧 [[Terraform plan shows bucket lifecycle drift]] — Fixed 11/23 ([[Cloud Platform Operations]])

## Crash Records / [[2025 Crash Data Load]]

**🔄 In progress**
- County and route ID validation (for Marcus Bell) (`feature/county-validation`) — Estimated Completion FY2027 Q2

**📐 Requirements added / changed**
- 🆕 [[CDL-REQ-004 2025 data on the public dashboard by Jan 15|CDL-REQ-004]] added (should) 11/24

**✅ Decisions**
- 11/24 — Use LRS v2 for route lookups. v1 is retired in March.

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `crash-dashboard/etl/`: 2 commits
    - `feature/county-validation` (5 ahead · 5 behind) · 2
        - ★ Tue 11-24 [`483e074`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/483e0742e647ab2883fee73771ededcd9b3c2036) etl: run all validations from one script (alex-rivera)
        - ★ Mon 11-23 [`a88b7ab`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/a88b7abdd56d8c81a41dc2beaa5dbe95ade58a98) etl: validation summary report for Marcus (alex-rivera)

**📝 Work log**
- Mon: validation summary query
- Tue: validate.py runs all checks

**⏭️ Coming up (11/30–12/6)**
- 📅 County and route ID validation (for Marcus Bell) (`feature/county-validation`) — Estimated Completion FY2027 Q2 (due Fri 12/4)
- 📅 Spot-check 50 fallback-geocoded crashes (for Dana Whitfield) — Estimated Completion FY2027 Q2 (due Wed 12/2)
- 🗓️ Wed 12/2 10:00 [[2026-12-02 Staging sign-off]] (Marcus Bell, Dana Whitfield)

## Cloud Platform / [[Cloud Platform Operations]]

**🔧 Issues fixed**
- [[Terraform plan shows bucket lifecycle drift]] — Fixed 11/23 (notify Sam Okafor)

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `infra/terraform/`: 1 commit
    - `main` (default) · 1
        - Mon 11-23 [`add6304`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/add630439a07d70a6689e63d83693285e5dd1b2f) terraform: bump OCI provider to 6.12 (jellis)

**📝 Work log**
- Tue: reviewed Jordan's provider bump

**⏭️ Coming up (11/30–12/6)**
- 📅 Review the cloud cost report — Estimated Completion FY2027 Q2 (due Sat 12/5)
- 📅 Request: GPU node for RoadView inference experiments (for Nina Shah) — Estimated Completion FY2027 Q2 (due Tue 12/1)

## Crash Records / [[Crash Records Operations]]

**✅ Completed**
- Request: 2025 fatal crash counts by county (for Marcus Bell) — Completed 11/23
- Send Marcus 2025 fatal crash counts by county (for Marcus Bell) — Completed 11/23

**✅ Decisions**
- 11/24 — Ad-hoc requests covering more than 5 years go through Marcus first. Keeps the queue sane.

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `crash-dashboard/reports/`: 1 commit
    - `main` (default) · 1
        - ★ Mon 11-23 [`fb13e4f`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/fb13e4fe96b6bed27e6cb72b64bbd2e148e947f5) reports: fatal crash counts by county (request from Marcus) (alex-rivera)

**📝 Work log**
- Mon: fatal crash counts by county for Marcus

**⏭️ Coming up (11/30–12/6)**
- 📅 Generate FHWA monthly crash extract (for Carla Mendes) — Estimated Completion FY2027 Q2 (due Tue 12/1)
- 📅 Request: Crash history for the US-119 corridor study (2021–2025) (for Dana Whitfield) — Estimated Completion FY2027 Q2 (due Fri 12/4)

## Crash Records / [[Paper Crash Form Retirement]]

**✅ Decisions**
- 11/24 — Paper forms received after Oct 30 are keyed by Traffic Safety staff, not scanned.

## RoadView / [[RoadView Backend]]

**🔄 In progress**
- Resumable uploads for clips over 2 GB (for Rita Gomez) (`feature/resumable-uploads`) — Estimated Completion FY2027 Q2

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/backend/`: 1 commit
    - `feature/resumable-uploads` (5 ahead · 8 behind) · 1
        - Mon 11-23 [`f437ead`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/f437eade656e02c105acd756026be57da2659b80) backend: tests for resume and cleanup (sokafor)

**⏭️ Coming up (11/30–12/6)**
- 🗓️ Tue 12/1 14:00 [[2026-12-01 Cellular upload pilot planning]] (Sam Okafor, Rita Gomez, Jordan Ellis)
- 📅 Load-test chunked uploads over cellular with Sam — Estimated Completion FY2027 Q2 (due Thu 12/3)
- ⏳ Follow up Mon 11/30: Firewall rule for the cellular APN range from [[Jordan Ellis]]

## RoadView / [[RoadView Frontend]]

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/frontend/`: 1 commit
    - `feature/map-clustering` (3 ahead · 5 behind) · 1
        - Mon 11-23 [`b1794cb`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/b1794cbbe8cbd0d5c7b0be5de11e9fcca083016e) frontend: click a cluster to filter the clip list (lpark)

## RoadView / [[RoadView Inference]]

**⏭️ Coming up (11/30–12/6)**
- ⏳ Follow up Tue 12/1: GPU quota increase from [[Jordan Ellis]]

## RoadView / [[RoadView Operations]]

**✅ Completed**
- Check the upload queue for stuck clips — Completed 11/23

**🗓️ Meetings**
- Mon 11/23 09:30 [[2026-11-23 Fleet ops monthly check-in]] (Rita Gomez)

**📝 Work log**
- Mon: fleet ops check-in with Rita

**⏭️ Coming up (11/30–12/6)**
- 📅 Send Rita the cellular pilot plan (for Rita Gomez) — Estimated Completion FY2027 Q2 (due Tue 12/1)
- 📅 Check the upload queue for stuck clips — Estimated Completion FY2027 Q2 (due Mon 11/30)

## Cloud Platform / [[SSO Migration]]

**🔄 In progress**
- SAML SP config for the crash dashboard (test IdP) (`feature/saml-sp-config`) — Estimated Completion FY2027 Q2

**🐞 Issues found**
- [[Test IdP clock skew rejects assertions]] (medium)

**📐 Requirements added / changed**
- ✏️ [[SSO-REQ-002 Roles come from directory groups|SSO-REQ-002]] v2 11/23: Wording: was "App roles are assigned from directory groups in the SAML assertion." → now "App roles are assigned from directory groups in the SAML assertion; us… (why: Analysts outside the groups still need read access) in [[2026-11-23 Claims mapping review]]

**🗓️ Meetings**
- Mon 11/23 15:00 [[2026-11-23 Claims mapping review]] (Tom Becker, Jordan Ellis)

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `infra/sso/`: 1 commit
    - `feature/saml-sp-config` (3 ahead · 5 behind) · 1
        - ★ Tue 11-24 [`d533ca5`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/d533ca54d49adafc00a3e3236b14ccb0710a52c0) sso: sign AuthnRequests with the new SP cert (test only) (alex-rivera)

**📝 Work log**
- Mon: claims mapping review; found the clock-skew issue
- Tue: signed AuthnRequests on the test IdP

**⏭️ Coming up (11/30–12/6)**
- 📅 Ask Tom's team to fix NTP on the test IdP — Estimated Completion FY2027 Q2 (due Tue 12/1)
- ⏳ Follow up Wed 12/2: Prod IdP change window from [[Tom Becker]]


---
*Generated 2026-11-24 16:00. To refresh, delete this note and run the Weekly Report template again.*

