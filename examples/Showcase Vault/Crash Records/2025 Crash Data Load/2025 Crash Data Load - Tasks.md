---
type: tasks
project: "[[2025 Crash Data Load]]"
cssclasses:
  - hide-done
---
# 2025 Crash Data Load: Tasks

> [!info] Full task history. **Reading view hides completed and cancelled tasks**: open **📜 History** at the bottom to see them (or Ctrl/Cmd+E).
> Open tasks from here *and* from meeting notes are rolled up on [[2025 Crash Data Load]].

## Tasks
- [x] Create staging tables for the 2025 extract 🌿 feature/2025-load ➕ 2026-11-02 ✅ 2026-11-03
- [x] Write the loader for the vendor extract 🌿 feature/2025-load ➕ 2026-11-03 ✅ 2026-11-10
- [-] Evaluate loading straight to prod ➕ 2026-11-04 ❌ 2026-11-04
- [x] Geocode fallback when the route ID is null 👤 [[Kevin O'Hara]] 🌿 feature/2025-load ➕ 2026-11-10 ✅ 2026-11-12
- [x] Give Dana read access to crash_stg 👤 [[Dana Whitfield]] ➕ 2026-11-16 ✅ 2026-11-18
- [/] County and route ID validation 👤 [[Marcus Bell]] 🌿 feature/county-validation 🎯 FY2027 Q2 ⏫ 📅 2026-12-04 ➕ 2026-11-16
- [ ] Promote 2025 data to crash_rpt (prod) 🎯 FY2027 Q3 ➕ 2026-11-20
- [ ] #waiting SELECT grant on crash_rpt.county_fips from [[Priya Natarajan]] 📅 2026-11-25 ➕ 2026-11-18
- [ ] Full staging load + validation summary to Marcus 👤 [[Marcus Bell]] 🎯 FY2027 Q2 🔼 📅 2026-12-11 ➕ 2026-11-24

## 📜 History
> [!example]- ✅ Done and ❌ cancelled tasks (click to show / hide)
> ```tasks
> (status.type is DONE) OR (status.type is CANCELLED)
> path includes {{query.file.folder}}
> group by status.name
> sort by done reverse
> short mode
> ```
