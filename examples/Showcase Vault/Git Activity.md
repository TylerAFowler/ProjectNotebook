---
type: git-activity
---
# 🧾 Git Activity: last 7 days
Every commit on every branch of every project's repos, grouped by project → repo → branch, plus PRs opened/merged.
★ = yours. Press **Ctrl+Shift+G** (Refresh Git) while on this page to update.

## Activity
<!-- git:start -->
*Wed Nov 18 – Tue Nov 24 · refreshed 2026-11-24 16:00 · ★ = yours*

### [[Cloud Platform Operations]]
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `infra/terraform/`: 1 commit
    - `main` (default) · 1
        - Mon 11-23 [`add6304`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/add630439a07d70a6689e63d83693285e5dd1b2f) terraform: bump OCI provider to 6.12 (jellis)

### [[SSO Migration]]
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `infra/sso/`: 2 commits
    - `feature/saml-sp-config` (3 ahead · 5 behind) · 2
        - ★ Tue 11-24 [`d533ca5`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/d533ca54d49adafc00a3e3236b14ccb0710a52c0) sso: sign AuthnRequests with the new SP cert (test only) (alex-rivera)
        - ★ Thu 11-19 [`c686bff`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/c686bffb4dae73faf7cfbf3f56931d8c2f482a84) sso: map the IdP's groups claim to dashboard roles (alex-rivera)

### [[2025 Crash Data Load]]
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `crash-dashboard/etl/`: 4 commits
    - `feature/county-validation` (5 ahead · 5 behind) · 4
        - ★ Tue 11-24 [`483e074`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/483e0742e647ab2883fee73771ededcd9b3c2036) etl: run all validations from one script (alex-rivera)
        - ★ Mon 11-23 [`a88b7ab`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/a88b7abdd56d8c81a41dc2beaa5dbe95ade58a98) etl: validation summary report for Marcus (alex-rivera)
        - ★ Thu 11-19 [`643cd1c`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/643cd1cc2ea3963f183f684b57c2d4508af30978) etl: route ID validation against LRS v2 (alex-rivera)
        - ★ Wed 11-18 [`a1b7a20`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/a1b7a20d2f5c9f2e44c9d24208fa7b5d9e3bae04) etl: also accept FIPS codes, map them to state codes (alex-rivera)

### [[Crash Dashboard Refresh]]
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `crash-dashboard/app/`: no activity

### [[Crash Records Operations]]
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `crash-dashboard/reports/`: 1 commit
    - `main` (default) · 1
        - ★ Mon 11-23 [`fb13e4f`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/fb13e4fe96b6bed27e6cb72b64bbd2e148e947f5) reports: fatal crash counts by county (request from Marcus) (alex-rivera)

### [[RoadView Backend]]
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/backend/`: 3 commits
    - `main` (default) · 1
        - Thu 11-19 [`997d032`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/997d0323782b5201d9758e5c1ddf4ebb5e548985) backend: /health endpoint for the load balancer (sokafor)
    - `feature/resumable-uploads` (5 ahead · 8 behind) · 2
        - Mon 11-23 [`f437ead`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/f437eade656e02c105acd756026be57da2659b80) backend: tests for resume and cleanup (sokafor)
        - ★ Fri 11-20 [`287ffc0`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/287ffc0dbff190291c5964ee5b1fb9b8ae0a99ba) backend: expire abandoned upload sessions after 48h (alex-rivera)

### [[RoadView Frontend]]
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/frontend/`: 3 commits
    - `main` (default) · 1
        - Fri 11-20 [`15952e6`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/15952e65f60b4d2d9b90e587faa46d98fed116c6) frontend: fix clip list paging (page 2 repeated page 1) (lpark)
    - `feature/map-clustering` (3 ahead · 5 behind) · 2
        - Mon 11-23 [`b1794cb`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/b1794cbbe8cbd0d5c7b0be5de11e9fcca083016e) frontend: click a cluster to filter the clip list (lpark)
        - Thu 11-19 [`26f472e`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/26f472e043eb699ecf207196a2a57000d332d131) frontend: cluster markers above 500 points (lpark)

### [[RoadView Inference]]
- [TylerAFowler/ObsidianNotesDemo](https://github.com/TylerAFowler/ObsidianNotesDemo) · `roadview/inference/`: 1 commit
    - `experiment/yolo-v9` (2 ahead · 5 behind) · 1
        - Thu 11-19 [`d89068c`](https://github.com/TylerAFowler/ObsidianNotesDemo/commit/d89068ce6a8a89194dd6866a711c5ebfd1fc2e89) inference: v9 batch size 8 keeps us inside the nightly window (nshah)
<!-- git:end -->
