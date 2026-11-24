---
type: weekly
week_start: 2026-11-16
week_end: 2026-11-22
---
# Weekly review: Nov 16 – Nov 22, 2026

> Everything that might be worth putting in the division report. Pick what matters and copy it over.
>
> 11 tasks completed · 3 tasks in progress · 5 issues found / 3 fixed · 5 requirement changes · 5 meetings · 3 decisions · 6 projects with Git activity

## 📣 Let people know
*Done or fixed this week for people waiting on it.*

**[[Carla Mendes]]**
- 🔧 [[FHWA extract missing body-type codes 70-79]] — Fixed 11/17 ([[Crash Records Operations]])

**[[Dana Whitfield]]**
- ✅ Give Dana read access to crash_stg — Completed 11/18 ([[2025 Crash Data Load]])

**[[Lena Park]]**
- 🔧 [[Clip timestamps off by 5 hours]] — Fixed 11/20 ([[RoadView Backend]])

**[[Marcus Bell]]**
- ✅ Request: Work-zone crash numbers for the legislative report — Completed 11/17 ([[Crash Records Operations]])

**[[Rita Gomez]]**
- 🔧 [[Clip timestamps off by 5 hours]] — Fixed 11/20 ([[RoadView Backend]])
- ✅ Store clip timestamps in UTC (`fix/clip-timestamp-tz`) — Completed 11/20 ([[RoadView Backend]])
- 🔧 [[Clip list page 2 repeats page 1]] — Fixed 11/20 ([[RoadView Frontend]])
- ✅ Request: Add 6 new trucks to RoadView — Completed 11/19 ([[RoadView Operations]])

**[[Tom Becker]]**
- ✅ Register SP metadata with the test IdP (`feature/saml-sp-config`) — Completed 11/19 ([[SSO Migration]])

## Crash Records / [[2025 Crash Data Load]]

**✅ Completed**
- Give Dana read access to crash_stg (for Dana Whitfield) — Completed 11/18

**🔄 In progress**
- County and route ID validation (for Marcus Bell) (`feature/county-validation`) — Estimated Completion FY2027 Q2

**🐞 Issues found**
- [[Vendor file uses FIPS county codes for some records]] (medium)

**📐 Requirements added / changed**
- ✏️ [[CDL-REQ-001 County codes validated|CDL-REQ-001]] v2 11/18: Wording: was "Every record's county code must match the state county list before it is loaded to prod." → now "Every record's county code must match the state c… (why: Vendor sends FIPS codes for ~4% of records) in [[2026-11-18 Validation rules review]]
- ✏️ [[CDL-REQ-003 Geocode fallback for missing route IDs|CDL-REQ-003]] v2 11/18: Wording: was "When the route ID is missing, locate the crash from county + milepost." → now "When the route ID is missing, locate the crash from county + milepo… (why: 3% of records have no route ID; dashboard needs them on the map) in [[2026-11-18 Validation rules review]]

**🗓️ Meetings**
- Wed 11/18 14:00 [[2026-11-18 Validation rules review]] (Marcus Bell, Dana Whitfield, Kevin O'Hara)

**✅ Decisions**
- 11/18 — Accept FIPS county codes and map them to state codes — rejecting 4% of 2025 is not an option

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `crash-dashboard/etl/`: 3 commits
    - `feature/county-validation` (5 ahead · 5 behind) · 3
        - ★ Thu 11-19 [`643cd1c`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/643cd1cc2ea3963f183f684b57c2d4508af30978) etl: route ID validation against LRS v2 (alex-rivera)
        - ★ Wed 11-18 [`a1b7a20`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/a1b7a20d2f5c9f2e44c9d24208fa7b5d9e3bae04) etl: also accept FIPS codes, map them to state codes (alex-rivera)
        - ★ Mon 11-16 [`1cd5028`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/1cd5028191ea3d0308d18c01f334bf95164b8e85) etl: county code validation query (alex-rivera)

**📝 Work log**
- Mon: started the county-code validation query
- Wed: FIPS mapping; validation rules review with Marcus, Dana and Kevin
- Thu: route ID validation against LRS v2

**⏭️ Coming up (11/23–11/29)**
- ⏳ Follow up Wed 11/25: SELECT grant on crash_rpt.county_fips from [[Priya Natarajan]]
- 📅 Book the staging sign-off meeting for early December — Estimated Completion FY2027 Q2 (due Wed 11/25)

## Cloud Platform / [[Cloud Platform Operations]]

**🐞 Issues found**
- [[Terraform plan shows bucket lifecycle drift]] (low)

## Crash Records / [[Crash Dashboard Refresh]]

**✅ Completed**
- Add 2025 to the year filter — Completed 11/17

**🐞 Issues found**
- [[County map legend unreadable in dark mode]] (low)

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `crash-dashboard/app/`: 1 commit
    - `main` (default) · 1
        - ★ Tue 11-17 [`778bb97`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/778bb97d16071fe2161ef4aafc1d7ea4b8607273) dashboard: add 2025 to the year filter (alex-rivera)

**📝 Work log**
- Tue: added 2025 to the year filter

## Crash Records / [[Crash Records Operations]]

**✅ Completed**
- Request: Work-zone crash numbers for the legislative report (for Marcus Bell) — Completed 11/17
- Add codes 70–79 to `crash_rpt.body_type_map` — Completed 11/17

**🔧 Issues fixed**
- [[FHWA extract missing body-type codes 70-79]] — Fixed 11/17 (notify Carla Mendes)

**🗓️ Meetings**
- Thu 11/19 13:00 [[2026-11-19 Safety Committee data check-in]] (Marcus Bell, Dana Whitfield)

**✅ Decisions**
- 11/19 — Preliminary 2025 numbers are OK for the committee packet if labelled preliminary — final numbers come after the staging sign-off

**📝 Work log**
- Tue: sent Marcus the work-zone crash numbers
- Thu: Safety Committee data check-in

**⏭️ Coming up (11/23–11/29)**
- ⏳ Follow up Fri 11/27: Read-only crash_rpt account for the GIS team from [[Priya Natarajan]]

## RoadView / [[RoadView Backend]]

**✅ Completed**
- Convert to UTC on ingest; viewer shows local time (`fix/clip-timestamp-tz`, merged Nov 20) — Completed 11/20
- Store clip timestamps in UTC (for Rita Gomez) (`fix/clip-timestamp-tz`) — Completed 11/20
- Expire abandoned upload sessions after 48h (`feature/resumable-uploads`) — Completed 11/20

**🔄 In progress**
- Resumable uploads for clips over 2 GB (for Rita Gomez) (`feature/resumable-uploads`) — Estimated Completion FY2027 Q2

**🐞 Issues found**
- [[Clip timestamps off by 5 hours]] (high)

**🔧 Issues fixed**
- [[Clip timestamps off by 5 hours]] — Fixed 11/20 (notify Rita Gomez, Lena Park)

**📐 Requirements added / changed**
- ✏️ [[RVB-REQ-002 Clips kept for 2 years|RVB-REQ-002]] v2 11/20: Wording: was "Clips are deleted 2 years after recording." → now "Clips are deleted 2 years after recording unless they are on legal hold. Every deletion is logg… (why: Legal needs holds for claims; Security needs a deletion log) in [[2026-11-20 Retention policy check]]

**🗓️ Meetings**
- Fri 11/20 10:00 [[2026-11-20 Retention policy check]] (Tom Becker, Rita Gomez)

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/backend/`: 4 commits
    - `main` (default) · 2
        - Thu 11-19 [`997d032`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/997d0323782b5201d9758e5c1ddf4ebb5e548985) backend: /health endpoint for the load balancer (sokafor)
        - ★ Wed 11-18 [`30ac2a4`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/30ac2a46add6ad38a9326073df690362222f4686) backend: store recorded_at in UTC (trucks send local time) (alex-rivera)
    - `feature/resumable-uploads` (5 ahead · 8 behind) · 2
        - ★ Fri 11-20 [`287ffc0`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/287ffc0dbff190291c5964ee5b1fb9b8ae0a99ba) backend: expire abandoned upload sessions after 48h (alex-rivera)
        - ★ Tue 11-17 [`2b40a56`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/2b40a568282918e5aa60f375e59bb454a659ba09) backend: resume from last confirmed part after a dropped connection (alex-rivera)

**📝 Work log**
- Mon: logged the clip timestamp issue Rita reported
- Tue: resume-from-last-part logic for chunked uploads
- Wed: UTC fix for clip timestamps
- Fri: merged the timestamp fix; 48h session expiry
- Fri: retention policy check with Tom and Rita

## RoadView / [[RoadView Frontend]]

**✅ Completed**
- Show clip times in the viewer's time zone (`fix/clip-timestamp-tz`) — Completed 11/19

**🐞 Issues found**
- [[Clip list page 2 repeats page 1]] (medium)

**🔧 Issues fixed**
- [[Clip list page 2 repeats page 1]] — Fixed 11/20 (notify Rita Gomez)

**🗓️ Meetings**
- Tue 11/17 15:30 [[2026-11-17 Map view demo]] (Lena Park, Rita Gomez)

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/frontend/`: 4 commits
    - `main` (default) · 2
        - Fri 11-20 [`15952e6`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/15952e65f60b4d2d9b90e587faa46d98fed116c6) frontend: fix clip list paging (page 2 repeated page 1) (lpark)
        - ★ Thu 11-19 [`867f42e`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/867f42e004fc8998017cb35860ad17b758e1d3cd) frontend: show clip time in the viewer's time zone (alex-rivera)
    - `feature/map-clustering` (3 ahead · 5 behind) · 2
        - Thu 11-19 [`26f472e`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/26f472e043eb699ecf207196a2a57000d332d131) frontend: cluster markers above 500 points (lpark)
        - Tue 11-17 [`283858b`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/283858b2527c6259033990c6de86d7be005d1483) frontend: map view of clip locations (lpark)

**📝 Work log**
- Tue: map view demo with Lena and Rita
- Fri: reviewed Lena's paging fix

**⏭️ Coming up (11/23–11/29)**
- 📅 Review Lena's map clustering branch #sticky (`feature/map-clustering`) — Estimated Completion FY2027 Q2 (due Thu 11/26)

## RoadView / [[RoadView Inference]]

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/inference/`: 1 commit
    - `experiment/yolo-v9` (2 ahead · 5 behind) · 1
        - Thu 11-19 [`d89068c`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/d89068ce6a8a89194dd6866a711c5ebfd1fc2e89) inference: v9 batch size 8 keeps us inside the nightly window (nshah)

## RoadView / [[RoadView Operations]]

**✅ Completed**
- Check the upload queue for stuck clips — Completed 11/16
- Request: Add 6 new trucks to RoadView (for Rita Gomez) — Completed 11/19

**📝 Work log**
- Mon: weekly upload-queue check: 2 stuck clips re-queued
- Thu: added 6 new trucks for Rita

**⏭️ Coming up (11/23–11/29)**
- 🗓️ Mon 11/23 09:30 [[2026-11-23 Fleet ops monthly check-in]] (Rita Gomez)
- 📅 Request: Pull clips for crash claim 26-0412 (US-50, Nov 12, truck 4471) (for Rita Gomez) — Estimated Completion FY2027 Q2 (due Wed 11/25)

## Cloud Platform / [[SSO Migration]]

**✅ Completed**
- Register SP metadata with the test IdP (for Tom Becker) (`feature/saml-sp-config`) — Completed 11/19

**🔄 In progress**
- SAML SP config for the crash dashboard (test IdP) (`feature/saml-sp-config`) — Estimated Completion FY2027 Q2

**📐 Requirements added / changed**
- 🆕 [[SSO-REQ-001 MFA enforced at the IdP|SSO-REQ-001]] added (must) 11/16 in [[2026-11-16 SSO kickoff]]
- 🆕 [[SSO-REQ-002 Roles come from directory groups|SSO-REQ-002]] added (must) 11/16 in [[2026-11-16 SSO kickoff]]

**🗓️ Meetings**
- Mon 11/16 13:00 [[2026-11-16 SSO kickoff]] (Tom Becker, Jordan Ellis)

**✅ Decisions**
- 11/16 — Crash dashboard is the first app on SAML — smallest user base, internal only

**🧾 Commits & pull requests** (★ = yours)
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `infra/sso/`: 2 commits
    - `feature/saml-sp-config` (3 ahead · 5 behind) · 2
        - ★ Thu 11-19 [`c686bff`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/c686bffb4dae73faf7cfbf3f56931d8c2f482a84) sso: map the IdP's groups claim to dashboard roles (alex-rivera)
        - Mon 11-16 [`c38edd4`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/c38edd4063e6937e1db777d93e5d8a3d1efd87de) sso: SP metadata for the test IdP (jellis)

**📝 Work log**
- Mon: kickoff with Tom and Jordan; drafted SP metadata
- Thu: groups-claim → role mapping; test IdP accepted our metadata

**⏭️ Coming up (11/23–11/29)**
- 🗓️ Mon 11/23 15:00 [[2026-11-23 Claims mapping review]] (Tom Becker, Jordan Ellis)

## Other

**📝 Work log**
- Wed: Half-day training: Oracle 23ai new features

**⏭️ Coming up (11/23–11/29)**
- 📅 Submit timesheet — Estimated Completion FY2027 Q2 (due Wed 11/25)


---
*Generated 2026-11-24 16:00. To refresh, delete this note and run the Weekly Report template again.*

