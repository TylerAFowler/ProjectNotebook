// Builds the showcase vault: a fictional transportation-agency IT team ("Alex Rivera" is the vault owner)
// with three categories, operations areas, projects, people, meetings, requirements, issues, tasks,
// Knowledge Base notes, daily notes and weekly reviews. Everything is created through the vault's real
// templates (so this doubles as an end-to-end test); free text is then filled in.
//
//   node showcase.js <copy-of-vault> <demo-code-repo-dir>
//
// The Git sections are filled from <demo-code-repo-dir> (made by tools/make-demo-code.py) through a fake
// GitHub API, with links pointing at DEMO_REPO_URL (default below).
const { run, app } = require("./harness");
const fs = require("fs"), path = require("path");
const V = process.argv[2], DEMO = process.argv[3];
if (!DEMO) { console.error("usage: node showcase.js <copy-of-vault> <demo-code-repo-dir>"); process.exit(2); }
const GH = process.env.DEMO_REPO_URL || "https://github.com/TylerAFowler/ObsidianNotesDemo";
const [, ghOwner, ghRepo] = new URL(GH).pathname.split("/");
global.__fetch = require("./fakegithub")({
  repoDir: DEMO, owner: ghOwner, repo: ghRepo, me: "alex-rivera",
  logins: { "alex.rivera@example.gov": "alex-rivera", "sam.okafor@example.gov": "sokafor", "lena.park@example.gov": "lpark",
            "jordan.ellis@example.gov": "jellis", "nina.shah@example.gov": "nshah" },
});
app.saveLocalStorage("git-token:github.com", "demo-token");

// ---------- helpers ----------
const rd = rel => fs.readFileSync(path.join(V, rel), "utf8");
const wr = (rel, s) => fs.writeFileSync(path.join(V, rel), s);
const edit = (rel, fn) => wr(rel, fn(rd(rel)));
const sub = (rel, pairs) => edit(rel, s => {
  for (const [a, b] of pairs) { if (!(a instanceof RegExp ? a.test(s) : s.includes(a))) throw new Error(`${rel}: can't find ${a}`); s = s.replace(a, b); }
  return s;
});
// Replace a "## …word…" section's placeholder lines (- / - [ ] / 1. / empty table rows) with `text`.
const fill = (rel, word, text) => edit(rel, d => {
  const L = d.split("\n");
  const h = L.findIndex(l => /^#{2,3} /.test(l) && l.toLowerCase().includes(word.toLowerCase()));
  if (h < 0) throw new Error(`${rel}: no section "${word}"`);
  let end = L.findIndex((l, i) => i > h && /^#{1,6} /.test(l)); if (end < 0) end = L.length;
  const body = L.slice(h + 1, end).filter(l => !/^\s*(- \[ \] |- |1\. |> |(\|\s*){2,})\s*$/.test(l));
  while (body.length && body[body.length - 1].trim() === "") body.pop();
  L.splice(h + 1, end - h - 1, ...body, ...text.trim().split("\n"), "");
  return L.join("\n");
});
const prop = (rel, key, value) => sub(rel, [[new RegExp(`^${key}:.*$`, "m"), `${key}: ${value}`]]);
const pick = name => (_ph, labels, values) => {
  const i = labels.findIndex(l => l.includes(name));
  if (i < 0) throw new Error(`no option "${name}" in: ${labels.join(" / ")}`);
  return values[i];
};
const NONE = (_p, _l, v) => v[v.length - 1];
const DEF = (_p, def) => def;          // accept a prompt's default
const hub = (cat, name) => `${cat}/${name}/${name}.md`;
const tasks = (cat, name) => `${cat}/${name}/${name} - Tasks.md`;
const meeting = (cat, proj, date, title) => `${cat}/${proj}/Meetings/${date} ${title}.md`;
const QC = (active, kind, ...answers) => run("Quick Capture", [kind, ...answers], { target: "scratch.md", active });
const leftOff = (rel, lines) => sub(rel, [["> - \n", lines.map(l => `> - ${l}`).join("\n") + "\n"]]);

const CR = "Crash Records", RV = "RoadView", CP = "Cloud Platform";
const LOAD = "2025 Crash Data Load", DASH = "Crash Dashboard Refresh", FORM = "Paper Crash Form Retirement";
const CRO = "Crash Records Operations", RVO = "RoadView Operations", CPO = "Cloud Platform Operations";
const RVB = "RoadView Backend", RVF = "RoadView Frontend", RVI = "RoadView Inference", SSO = "SSO Migration";

(async () => {
  // ======================= Categories, operations areas, projects =======================
  await run("New Operations", ["__new__", CR, "__done__", CRO, true, false]);
  await run("New Project", [CR, "__done__", LOAD, true]);
  await run("New Project", [CR, "__done__", DASH, false]);
  await run("New Project", [CR, "__done__", FORM, false]);
  await run("New Operations", ["__new__", RV, "__done__", RVO, false, false]);
  await run("New Project", [RV, "__new__", CP, "__done__", RVB, true]);
  await run("New Operations", [CP, "__done__", CPO, false, false]);
  await run("New Project", [RV, "__done__", RVF, false]);
  await run("New Project", [RV, CP, "__done__", RVI, false]);
  await run("New Project", [CP, CR, "__done__", SSO, false]);

  // ======================= People =======================
  const PEOPLE = [
    ["Priya Natarajan", "Database Administrator", "IT Data Services", "Approves schema changes and new database accounts. Prefers a Teams message over email."],
    ["Marcus Bell", "Crash Records Program Manager", "Traffic Safety Division", "Business owner for crash data and the public dashboard. Signs off on staging before anything goes to prod."],
    ["Dana Whitfield", "Traffic Safety Engineer", "Traffic Safety Division", "Heaviest dashboard user (HSIP analysis). Good tester; very fast feedback."],
    ["Kevin O'Hara", "GIS Analyst (LRS)", "Planning Division", "Owns the LRS. Ask him before assuming a route ID is bad."],
    ["Sam Okafor", "Developer", "IT Applications", "RoadView backend lead. Pairs with me on resumable uploads."],
    ["Lena Park", "Front-end Developer", "IT Applications", "RoadView viewer and the crash dashboard UI."],
    ["Jordan Ellis", "Cloud Engineer", "IT Infrastructure", "Tenancy, networking, Terraform. Firewall and quota requests go to Jordan."],
    ["Nina Shah", "Data Scientist", "IT Applications", "RoadView sign / guardrail detection models."],
    ["Rita Gomez", "Fleet Operations Supervisor", "Equipment Division", "Main RoadView customer: trucks, cameras, crash-claim clip requests."],
    ["Tom Becker", "Information Security Officer", "IT Security", "Approves IdP changes and retention rules. Needs 2 weeks' notice for prod IdP changes."],
    ["Carla Mendes", "Safety Specialist", "FHWA Division Office", "Outside the agency. Receives the monthly FHWA crash extract."],
  ];
  for (const [name, role, org, note] of PEOPLE) {
    await run("Person", [name]);
    const rel = `People/${name}.md`;
    prop(rel, "role", role); prop(rel, "org", org);
    fill(rel, "Notes", `- ${note}`);
  }

  // ======================= Crash Records Operations =======================
  {
    const H = hub(CR, CRO), T = tasks(CR, CRO);
    fill(T, "Recurring", `
- [x] Generate FHWA monthly crash extract 👤 [[Carla Mendes]] 🔁 every month on the 1st 📅 2026-11-01 ➕ 2026-09-01 ✅ 2026-11-03
- [ ] Generate FHWA monthly crash extract 👤 [[Carla Mendes]] 🔁 every month on the 1st 📅 2026-12-01 ➕ 2026-09-01
- [ ] Quarterly fatality report for the Safety Committee 👤 [[Marcus Bell]] 🔁 every 3 months on the 15th 📅 2027-01-15 ➕ 2026-07-01
- [ ] Review who has access to crash_rpt 🔁 every 6 months 📅 2026-12-15 ➕ 2026-06-15`);
    fill(T, "Requests", `
- [x] #request Work-zone crash numbers for the legislative report 👤 [[Marcus Bell]] ➕ 2026-11-09 ✅ 2026-11-17
- [x] #request 2025 fatal crash counts by county 👤 [[Marcus Bell]] 📅 2026-11-25 ➕ 2026-11-19 ✅ 2026-11-23`);
    fill(T, "Tasks", `
- [ ] Update the FHWA extract runbook for the new vehicle body-type codes 🔽 ➕ 2026-11-20`);
    await QC(H, "request", pick(CRO), "Crash history for the US-119 corridor study (2021–2025)", "Dana Whitfield", "2026-12-04");
    await QC(H, "waiting", pick(CRO), "Read-only crash_rpt account for the GIS team from [[Priya Natarajan]]", "2026-11-27");
    await QC(H, "deliverable", pick(CRO), "Monthly FHWA crash extract", "Carla Mendes (FHWA)", "Monthly, by the 5th", "Monthly FHWA crash extract");
    await QC(H, "deliverable", pick(CRO), "Quarterly fatality report", "Safety Committee via Marcus Bell", "Quarterly, by the 15th", "Quarterly fatality report");
    await QC(H, "aware", pick(CRO), "FHWA wants the extract pipe-delimited, not CSV. Location descriptions contain commas.");
    await QC(H, "aware", pick(CRO), "The last 30 days of crash data are preliminary. Say so in every ad-hoc request.");
    await QC(H, "command", pick(CRO), "sqlplus crash_rpt@CRASHPRD @crash-dashboard/reports/fhwa_monthly.sql");
    await QC(H, "decision", pick(CRO), "Ad-hoc requests covering more than 5 years go through Marcus first. Keeps the queue sane.");
    await QC(H, "link", pick(CRO), "FHWA crash data portal", "Where the monthly extract is uploaded", "https://fhwa-portal.example.gov/crash-upload");

    await run("Runbook", [pick(CRO), "Monthly FHWA crash extract", "monthly", "Crash data", ""]);
    const RB = `${CR}/${CRO}/Runbooks/Monthly FHWA crash extract.md`;
    prop(RB, "last_run", "2026-11-03");
    fill(RB, "What it produces", "- One pipe-delimited file of every crash reported last month (one row per vehicle), uploaded to the FHWA portal for [[Carla Mendes]].");
    fill(RB, "Inputs", "- `crash_rpt` read access on CRASHPRD\n- FHWA portal login (shared mailbox account; password in the team vault)");
    fill(RB, "Steps", "1. Wait until the 1st; the nightly load must have run (check `crash_rpt.load_log`).\n2. Run the extract query (below) and spool to `fhwa_YYYYMM.txt`.\n3. Spot-check: row count within ±10% of last month.\n4. Upload to the FHWA portal and email Carla the confirmation number.");
    fill(RB, "Commands", "```sql\n-- crash-dashboard/reports/fhwa_monthly.sql\nSET COLSEP '|' TRIMSPOOL ON PAGESIZE 0\nSPOOL fhwa_202611.txt\n@fhwa_monthly.sql\nSPOOL OFF\n```");
    fill(RB, "Output", "- FHWA portal → *Monthly crash extract*. Confirmation email to [[Carla Mendes]].");
    fill(RB, "check it worked", "- Portal shows *Accepted* within an hour. A *Rejected* status almost always means a new code value (see Gotchas).");
    fill(RB, "Gotchas", "- New vehicle body-type codes (70–79) were added in 2026; the portal rejects unknown codes. See [[FHWA extract missing body-type codes 70-79]].");
    fill(RB, "Run log", "- 2026-10-02 — normal, 4,812 rows\n- 2026-11-03 — re-ran after fixing body-type codes, 4,655 rows");

    await run("Runbook", [pick(CRO), "Quarterly fatality report", "quarterly", "Crash data", ""]);
    const RB2 = `${CR}/${CRO}/Runbooks/Quarterly fatality report.md`;
    fill(RB2, "What it produces", "- A two-page PDF of fatal crashes by county and road type for the Safety Committee, sent via [[Marcus Bell]].");
    fill(RB2, "Steps", "1. Run `crash-dashboard/reports/fatal_by_county.sql` for the quarter.\n2. Paste into the committee template (link below) and refresh the charts.\n3. Send to Marcus for review two days before the committee meets.");

    await run("Meeting", [pick(CRO), "Safety Committee data check-in", "2026-11-19", "13:00", "Marcus Bell, Dana Whitfield"]);
    const M = meeting(CR, CRO, "2026-11-19", "Safety Committee data check-in");
    fill(M, "Agenda", "- Status of the 2025 data load\n- Fatal crash counts for the December committee packet");
    fill(M, "Notes", "- Marcus needs 2025 fatal counts by county before Thanksgiving\n- Dana asked for US-119 corridor history (2021–2025) for a corridor study");
    fill(M, "Decisions", "- 2026-11-19 — Preliminary 2025 numbers are OK for the committee packet if labelled preliminary — final numbers come after the staging sign-off");
    fill(M, "Action items", "- [x] Send Marcus 2025 fatal crash counts by county 👤 [[Marcus Bell]] 📅 2026-11-25 ➕ 2026-11-19 ✅ 2026-11-23");

    await run("Issue", [pick(CRO), "FHWA extract missing body-type codes 70-79", "medium", "Carla Mendes"]);
    const I = `${CR}/${CRO}/Issues/FHWA extract missing body-type codes 70-79.md`;
    prop(I, "found", "2026-11-04"); prop(I, "status", "fixed"); prop(I, "fixed", "2026-11-17"); prop(I, "ticket", "SD-48211");
    fill(I, "Symptoms", "- FHWA portal rejected the November extract: *unknown BODY_TYPE 74*");
    fill(I, "Cause", "- The 2026 crash form added body-type codes 70–79 (e-bikes, scooters); the extract's lookup table didn't have them.");
    fill(I, "Fix", "- [x] Add codes 70–79 to `crash_rpt.body_type_map` ✅ 2026-11-17\n- [ ] Update the FHWA extract runbook for the new codes 🔽");
    fill(I, "Steps to reproduce", "1. Run the extract for any month after 2026-07\n2. Upload: portal rejects rows with body types 70–79");
  }

  // ======================= 2025 Crash Data Load =======================
  {
    const H = hub(CR, LOAD), T = tasks(CR, LOAD), D = `${CR}/${LOAD}`;
    sub(H, [["status: active", "status: active\nreq_prefix: CDL"]]);
    prop(H, "started", "2026-11-02");
    prop(H, "next_action", "Run validate.py against the full staging load and send Marcus the summary");
    leftOff(H, [
      "County and route ID validation are done on `feature/county-validation`; `validate.py` runs both.",
      "Next: full staging load, then send the validation summary to [[Marcus Bell]] (due Dec 4).",
      "Blocked on [[Priya Natarajan]] for the grant on `crash_rpt.county_fips` (asked Nov 18, follow up Nov 25).",
    ]);
    fill(T, "Tasks", `
- [x] Create staging tables for the 2025 extract 🌿 feature/2025-load ➕ 2026-11-02 ✅ 2026-11-03
- [x] Write the loader for the vendor extract 🌿 feature/2025-load ➕ 2026-11-03 ✅ 2026-11-10
- [-] Evaluate loading straight to prod ➕ 2026-11-04 ❌ 2026-11-04
- [x] Geocode fallback when the route ID is null 👤 [[Kevin O'Hara]] 🌿 feature/2025-load ➕ 2026-11-10 ✅ 2026-11-12
- [x] Give Dana read access to crash_stg 👤 [[Dana Whitfield]] ➕ 2026-11-16 ✅ 2026-11-18
- [/] County and route ID validation 👤 [[Marcus Bell]] 🌿 feature/county-validation 🎯 FY2027 Q2 ⏫ 📅 2026-12-04 ➕ 2026-11-16
- [ ] Promote 2025 data to crash_rpt (prod) 🎯 FY2027 Q3 ➕ 2026-11-20
- [ ] #waiting SELECT grant on crash_rpt.county_fips from [[Priya Natarajan]] 📅 2026-11-25 ➕ 2026-11-18`);
    await QC(H, "task", pick(LOAD), "Full staging load + validation summary to Marcus", "", "2026-12-11", "FY2027 Q2", " 🔼", "", "Marcus Bell");

    await run("Meeting", [pick(LOAD), "2025 load kickoff", "2026-11-04", "10:00", "Marcus Bell, Priya Natarajan, Dana Whitfield, Kevin O'Hara"]);
    const K = meeting(CR, LOAD, "2026-11-04", "2025 load kickoff");
    fill(K, "Prep", "- Does Marcus want prod updated in one go, or staging first?\n- Who signs off on schema changes? (Priya)");
    fill(K, "Agenda", "- Scope and timeline for the 2025 extract\n- Validation rules\n- Who signs off on staging");
    fill(K, "Notes", "- Vendor delivers the full 2025 extract by Nov 6, pipe-delimited\n- Marcus wants 2025 on the public dashboard by mid-January\n- Kevin: about 3% of 2024 records had no route ID; expect the same\n- Priya will create `crash_stg` tables from the DDL on the branch");
    fill(K, "Decisions", "- 2026-11-04 — Load to staging first; prod only after Marcus signs off — lets Traffic Safety validate before the public sees it");
    fill(K, "Action items", "- [x] Send Marcus the 2025 extract field list 👤 [[Marcus Bell]] 📅 2026-11-06 ➕ 2026-11-04 ✅ 2026-11-05\n- [ ] Book the staging sign-off meeting for early December 📅 2026-11-25 ➕ 2026-11-04");
    await run("Requirement", [pick(LOAD), "County codes validated", "Every record's county code must match the state county list before it is loaded to prod.", "must", "proposed", pick("2025 load kickoff"), "Marcus Bell, Priya Natarajan"], { active: K });
    await run("Requirement", [pick(LOAD), "Route IDs checked against LRS v2", "Every non-null route ID must exist in LRS v2; unknown routes are reported, not dropped.", "must", "approved", pick("2025 load kickoff"), "Kevin O'Hara"], { active: K });
    await run("Requirement", [pick(LOAD), "Geocode fallback for missing route IDs", "When the route ID is missing, locate the crash from county + milepost.", "should", "proposed", pick("2025 load kickoff"), "Kevin O'Hara"], { active: K });
    await run("Requirement", [pick(LOAD), "2025 data on the public dashboard by Jan 15", "Validated 2025 crash data is visible on the public dashboard by 2027-01-15.", "should", "approved", NONE, "Marcus Bell"], { active: H });

    await run("Meeting", [pick(LOAD), "Validation rules review", "2026-11-18", "14:00", "Marcus Bell, Dana Whitfield, Kevin O'Hara"]);
    const VR = meeting(CR, LOAD, "2026-11-18", "Validation rules review");
    fill(VR, "Agenda", "- Walk through the county / route validation queries\n- FIPS codes in the vendor file\n- Geocoding fallback");
    fill(VR, "Notes", "- About 4% of records use FIPS county codes (54xxx) instead of state codes\n- Kevin confirmed county + milepost is accurate enough for the fallback\n- Dana will spot-check 50 fallback-geocoded crashes against the paper reports");
    fill(VR, "Decisions", "- 2026-11-18 — Accept FIPS county codes and map them to state codes — rejecting 4% of 2025 is not an option");
    fill(VR, "Action items", "- [ ] Spot-check 50 fallback-geocoded crashes 👤 [[Dana Whitfield]] 📅 2026-12-02 ➕ 2026-11-18");
    const R1 = `${D}/Requirements/CDL-REQ-001 County codes validated.md`, R3 = `${D}/Requirements/CDL-REQ-003 Geocode fallback for missing route IDs.md`;
    await run("Change Requirement", [pick(LOAD), pick("CDL-REQ-001"), "all", "Every record's county code must match the state county list, or be a valid FIPS code that maps to one, before it is loaded to prod.", "approved", "must", "Vendor sends FIPS codes for ~4% of records", pick("Validation rules review"), DEF], { target: "scratch.md", active: VR });
    await run("Change Requirement", [pick(LOAD), pick("CDL-REQ-003"), "all", "When the route ID is missing, locate the crash from county + milepost and flag it as approximate.", "approved", "must", "3% of records have no route ID; dashboard needs them on the map", pick("Validation rules review"), "Kevin O'Hara, Marcus Bell"], { target: "scratch.md", active: VR });
    fill(R1, "Acceptance criteria", "- [ ] `validation/county_codes.sql` returns 0 rows on the full staging load\n- [ ] FIPS codes map through `crash_rpt.county_fips`");
    fill(R3, "Acceptance criteria", "- [x] Fallback implemented in `etl/geocode.py`\n- [ ] Dana's 50-crash spot-check passes");

    await run("Meeting", [pick(LOAD), "Staging sign-off", "2026-12-02", "10:00", "Marcus Bell, Dana Whitfield"]);
    fill(meeting(CR, LOAD, "2026-12-02", "Staging sign-off"), "Prep", "- Bring the validation summary (failures by check)\n- Dana's spot-check results\n- Ask: OK to promote to prod the week of Dec 14?");

    await run("Issue", [pick(LOAD), "Null route IDs break geocoding", "high", "Kevin O'Hara, Marcus Bell"]);
    const I1 = `${D}/Issues/Null route IDs break geocoding.md`;
    prop(I1, "found", "2026-11-10"); prop(I1, "status", "fixed"); prop(I1, "fixed", "2026-11-12");
    fill(I1, "Symptoms", "- About 3% of 2025 crashes got no latitude/longitude");
    fill(I1, "Cause", "- The LRS lookup needs a route ID; the vendor leaves it blank for crashes on local roads");
    fill(I1, "Fix", "- [x] Fall back to county + milepost (`etl/geocode.py`, commit on `feature/2025-load`) ✅ 2026-11-12");
    await run("Issue", [pick(LOAD), "Vendor file uses FIPS county codes for some records", "medium", "Marcus Bell"]);
    const I2 = `${D}/Issues/Vendor file uses FIPS county codes for some records.md`;
    prop(I2, "found", "2026-11-16"); prop(I2, "status", "workaround");
    fill(I2, "Symptoms", "- ~4% of records fail county validation with codes like 54039");
    fill(I2, "Workaround", "- Map FIPS → state county code via `crash_rpt.county_fips` (needs Priya's grant)");
    fill(I2, "Fix", "- [ ] Ask the vendor to send state county codes from the 2026 extract on 📅 2027-01-08");

    await run("Note", [pick(LOAD), "Validation approach"]);
    edit(`${D}/Notes/Validation approach.md`, s => s + "Each check is one SQL file in `crash-dashboard/etl/validation/` returning the failing rows. `validate.py` runs them all and prints counts; the summary for Marcus is the counts plus 10 sample rows per check.\n\n| Check | Requirement | Expected failures |\n| ----- | ----------- | ----------------- |\n| County codes | [[CDL-REQ-001 County codes validated]] | 0 after FIPS mapping |\n| Route IDs | [[CDL-REQ-002 Route IDs checked against LRS v2]] | < 0.5% (reported, not dropped) |\n");

    await QC(H, "aware", pick(LOAD), "crash_stg is refreshed from prod every Sunday at 02:00. Don't leave test data there.");
    await QC(H, "aware", pick(LOAD), "The vendor file is UTF-8 with a BOM; open it with encoding='utf-8-sig' or the first column name is wrong.");
    await QC(H, "decision", pick(LOAD), "Use LRS v2 for route lookups. v1 is retired in March.");
    await QC(H, "command", pick(LOAD), "python crash-dashboard/etl/load_2025.py /data/vendor/crash_2025.txt");
    await QC(H, "command", pick(LOAD), "python crash-dashboard/etl/validate.py");
    await QC(H, "doc", pick(LOAD), "2025 vendor extract layout", "Every field in the vendor file with types and code lists; use when mapping to staging", "\\\\fileserver\\CrashRecords\\Specs\\2025_extract_layout.xlsx");
    await QC(H, "doc", pick(LOAD), "Schema change request CR-1187", "Approved change for the new staging tables (Priya's sign-off is on page 2)", "https://sharepoint.example.gov/sites/crash/Shared Documents/CR-1187.docx");
    await QC(H, "link", pick(LOAD), "LRS v2 API docs", "Route lookup and county/milepost endpoints used by geocode.py", "https://lrs.example.gov/api/v2/docs");
    await QC(H, "faq", pick(LOAD), "When will 2025 crash data be on the public dashboard?", "Target is January 15 ([[CDL-REQ-004 2025 data on the public dashboard by Jan 15]]). It goes to staging first and Marcus signs off before prod.");
    await QC(H, "faq", pick(LOAD), "Why do some 2025 crashes show an approximate location?", "Crashes without a route ID are placed from county + milepost ([[CDL-REQ-003 Geocode fallback for missing route IDs]]). They're flagged as approximate on the map.");
    sub(H, [["| Dev  |       |\n| Prod |       |\n| Repo |       |", "| Dev  | `crash_stg` on CRASHDEV |\n| Prod | `crash_rpt` on CRASHPRD |\n| Repo | `crash-dashboard/etl` in the demo repo |"]]);
    fill(H, "People", "- [[Marcus Bell]]: business owner, signs off on staging\n- [[Priya Natarajan]]: DBA, grants and schema changes\n- [[Kevin O'Hara]]: LRS questions\n- [[Dana Whitfield]]: tester / main user");
  }

  // ======================= Crash Dashboard Refresh =======================
  {
    const H = hub(CR, DASH), T = tasks(CR, DASH);
    prop(H, "started", "2026-10-01");
    prop(H, "next_action", "Agree the county map design with Dana");
    leftOff(H, ["2025 is in the year filter (waiting on the data load for real data).", "Next: county density map mock-up for [[Dana Whitfield]]."]);
    fill(T, "Tasks", `
- [x] Add 2025 to the year filter ➕ 2026-11-16 ✅ 2026-11-17
- [ ] County map with crash density 👤 [[Dana Whitfield]] 🎯 FY2027 Q3 ➕ 2026-11-10
- [ ] Accessibility review of the charts (WCAG 2.1 AA) 🎯 FY2027 Q3 🔼 ➕ 2026-11-10
- [ ] Replace the parked CSV export with downloads in the new UI 🌿 old/csv-export 🔽 ➕ 2026-10-07`);
    await run("Meeting", [pick(DASH), "Dashboard refresh scope", "2026-11-10", "15:00", "Marcus Bell, Dana Whitfield, Lena Park"]);
    const M = meeting(CR, DASH, "2026-11-10", "Dashboard refresh scope");
    fill(M, "Notes", "- Dana wants a county density map more than anything else\n- Marcus: downloads (CSV/Excel) are a must for the public\n- Lena can reuse the RoadView map component");
    fill(M, "Decisions", "- 2026-11-10 — Reuse the RoadView Leaflet map component — one map stack to maintain");
    await run("Issue", [pick(DASH), "County map legend unreadable in dark mode", "low", "Dana Whitfield"]);
    const I = `${CR}/${DASH}/Issues/County map legend unreadable in dark mode.md`;
    prop(I, "found", "2026-11-19");
    fill(I, "Symptoms", "- Legend text is dark grey on a dark background when the OS is in dark mode");
    await QC(H, "link", pick(DASH), "Public crash dashboard", "The live site; compare against staging before each release", "https://crashdata.example.gov");
  }

  // ======================= Paper Crash Form Retirement (finished project) =======================
  {
    const H = hub(CR, FORM), T = tasks(CR, FORM);
    prop(H, "status", "done"); prop(H, "started", "2026-06-01"); prop(H, "next_action", "");
    leftOff(H, ["Finished 2026-10-30. The old form's PDF is archived; see the retrospective in the Knowledge Base."]);
    fill(T, "Tasks", `
- [x] Inventory agencies still sending paper forms 👤 [[Marcus Bell]] ➕ 2026-06-01 ✅ 2026-06-20
- [x] Train the last 4 agencies on the e-crash portal ➕ 2026-07-01 ✅ 2026-09-15
- [x] Turn off the paper-form scanning job ➕ 2026-10-01 ✅ 2026-10-30
- [x] Archive the scanning share to cold storage ➕ 2026-10-01 ✅ 2026-10-30`);
    await QC(H, "decision", pick(FORM), "Paper forms received after Oct 30 are keyed by Traffic Safety staff, not scanned.");
  }

  // ======================= RoadView Operations =======================
  {
    const H = hub(RV, RVO), T = tasks(RV, RVO);
    fill(T, "Recurring", `
- [x] Check the upload queue for stuck clips 🔁 every week on Monday 📅 2026-11-16 ➕ 2026-10-01 ✅ 2026-11-16
- [x] Check the upload queue for stuck clips 🔁 every week on Monday 📅 2026-11-23 ➕ 2026-10-01 ✅ 2026-11-23
- [ ] Check the upload queue for stuck clips 🔁 every week on Monday 📅 2026-11-30 ➕ 2026-10-01`);
    fill(T, "Requests", `
- [x] #request Add 6 new trucks to RoadView 👤 [[Rita Gomez]] ➕ 2026-11-12 ✅ 2026-11-19`);
    await QC(H, "request", pick(RVO), "Pull clips for crash claim 26-0412 (US-50, Nov 12, truck 4471)", "Rita Gomez", "2026-11-25");
    await QC(H, "aware", pick(RVO), "Trucks only upload on depot Wi-Fi unless the cellular pilot flag is set on the truck.");
    await QC(H, "command", pick(RVO), "curl -X POST https://roadview.example.gov/api/admin/requeue/<clip_id>");
    await run("Runbook", [pick(RVO), "Re-queue a failed clip upload", "ad hoc", "RoadView", ""]);
    const RB = `${RV}/${RVO}/Runbooks/Re-queue a failed clip upload.md`;
    fill(RB, "Steps", "1. Find the clip in the admin page (filter *Failed*).\n2. Check the truck was on Wi-Fi when it failed; if not, wait for the next depot visit.\n3. POST to `/api/admin/requeue/<clip_id>` (command on the area hub).\n4. Confirm it shows *Uploaded* within 15 minutes.");
    await run("Runbook", [pick(RVO), "Onboard a new truck", "ad hoc", "RoadView", ""]);
    fill(`${RV}/${RVO}/Runbooks/Onboard a new truck.md`, "Steps", "1. Get the truck number and camera serial from [[Rita Gomez]].\n2. Add the truck in the admin page; download its device certificate.\n3. Load the cert onto the camera's SD card (`/certs/device.pem`).\n4. Ask Rita's team to park it at the depot overnight; check the first upload next morning.");
    await run("Meeting", [pick(RVO), "Fleet ops monthly check-in", "2026-11-23", "09:30", "Rita Gomez"]);
    const M = meeting(RV, RVO, "2026-11-23", "Fleet ops monthly check-in");
    fill(M, "Notes", "- 6 new trucks are uploading fine\n- Rita needs clips for crash claim 26-0412 by Wednesday\n- Large-clip failures on cellular are the #1 complaint (see [[Uploads over 2 GB fail on cellular]])");
    fill(M, "Action items", "- [ ] Send Rita the cellular pilot plan 👤 [[Rita Gomez]] 📅 2026-12-01 ➕ 2026-11-23");
  }

  // ======================= RoadView Backend =======================
  {
    const H = hub(RV, RVB), T = tasks(RV, RVB), D = `${RV}/${RVB}`;
    sub(H, [["status: active", "status: active\nreq_prefix: RVB"]]);
    prop(H, "started", "2026-09-21");
    prop(H, "next_action", "Review Sam's resume tests, then plan the cellular load test");
    leftOff(H, [
      "Resumable uploads: resume + 48h cleanup done on `feature/resumable-uploads`; [[Sam Okafor]] added tests (Nov 23).",
      "Next: review the tests, then load-test over cellular. Needs [[Jordan Ellis]]'s firewall rule first.",
    ]);
    fill(T, "Tasks", `
- [x] Store clip timestamps in UTC 👤 [[Rita Gomez]] 🌿 fix/clip-timestamp-tz ➕ 2026-11-17 ✅ 2026-11-20
- [x] Expire abandoned upload sessions after 48h 🌿 feature/resumable-uploads ➕ 2026-11-17 ✅ 2026-11-20
- [/] Resumable uploads for clips over 2 GB 👤 [[Rita Gomez]] 🌿 feature/resumable-uploads 🎯 FY2027 Q2 ⏫ 📅 2026-12-18 ➕ 2026-11-06
- [ ] Load-test chunked uploads over cellular with Sam 📅 2026-12-03 ➕ 2026-11-23
- [ ] Retention: delete clips after 2 years unless on legal hold 👤 [[Tom Becker]] 🎯 FY2027 Q4 🔽 ➕ 2026-11-20`);
    await QC(H, "waiting", pick(RVB), "Firewall rule for the cellular APN range from [[Jordan Ellis]]", "2026-11-30");

    await run("Meeting", [pick(RVB), "Upload reliability review", "2026-11-09", "11:00", "Sam Okafor, Rita Gomez, Jordan Ellis"]);
    const UR = meeting(RV, RVB, "2026-11-09", "Upload reliability review");
    fill(UR, "Notes", "- 1 in 8 clips over 2 GB fails when trucks upload on cellular\n- Raising the size limit doesn't help; connections drop mid-upload\n- Jordan: object storage supports multipart uploads with 64 MB parts");
    fill(UR, "Decisions", "- 2026-11-09 — Chunked multipart uploads (64 MB parts) instead of raising the size limit — trucks lose signal mid-upload");
    await run("Requirement", [pick(RVB), "Uploads survive dropped connections", "A clip upload interrupted by a lost connection resumes from the last confirmed part; no clip is lost or duplicated.", "must", "approved", pick("Upload reliability review"), DEF], { active: UR });
    await run("Requirement", [pick(RVB), "Clips kept for 2 years", "Clips are deleted 2 years after recording.", "should", "proposed", pick("Upload reliability review"), "Rita Gomez"], { active: UR });
    await run("Meeting", [pick(RVB), "Retention policy check", "2026-11-20", "10:00", "Tom Becker, Rita Gomez"]);
    const RP = meeting(RV, RVB, "2026-11-20", "Retention policy check");
    fill(RP, "Notes", "- Legal needs holds on clips tied to claims or lawsuits\n- Tom: deletion must be logged");
    await run("Change Requirement", [pick(RVB), pick("RVB-REQ-002"), "all", "Clips are deleted 2 years after recording unless they are on legal hold. Every deletion is logged.", "approved", "should", "Legal needs holds for claims; Security needs a deletion log", pick("Retention policy check"), DEF], { target: "scratch.md", active: RP });
    await run("Meeting", [pick(RVB), "Cellular upload pilot planning", "2026-12-01", "14:00", "Sam Okafor, Rita Gomez, Jordan Ellis"]);
    fill(meeting(RV, RVB, "2026-12-01", "Cellular upload pilot planning"), "Agenda", "- Which 5 trucks go in the pilot\n- Data plan limits\n- What 'success' looks like after 2 weeks");

    await run("Issue", [pick(RVB), "Clip timestamps off by 5 hours", "high", "Rita Gomez, Lena Park"]);
    const I1 = `${D}/Issues/Clip timestamps off by 5 hours.md`;
    prop(I1, "found", "2026-11-16"); prop(I1, "status", "fixed"); prop(I1, "fixed", "2026-11-20");
    fill(I1, "Symptoms", "- Clips show 5 hours later than recorded in the viewer (reported by Rita for a crash claim)");
    fill(I1, "Cause", "- Trucks send local time without an offset; the API stored it as UTC");
    fill(I1, "Fix", "- [x] Convert to UTC on ingest; viewer shows local time (`fix/clip-timestamp-tz`, merged Nov 20) ✅ 2026-11-20");
    await run("Issue", [pick(RVB), "Uploads over 2 GB fail on cellular", "high", "Rita Gomez"]);
    const I2 = `${D}/Issues/Uploads over 2 GB fail on cellular.md`;
    prop(I2, "found", "2026-11-06"); prop(I2, "status", "workaround");
    fill(I2, "Symptoms", "- Long clips (> 2 GB) fail and restart from zero when the truck loses signal");
    fill(I2, "Workaround", "- Trucks upload large clips at the depot on Wi-Fi only");
    fill(I2, "Fix", "- [ ] Resumable uploads (see tasks) 📅 2026-12-18");

    await run("Note", [pick(RVB), "Upload chunk size notes"]);
    edit(`${D}/Notes/Upload chunk size notes.md`, s => s + "| Part size | Parts for 4 GB | Retry cost on drop |\n| --------- | -------------- | ------------------ |\n| 16 MB | 256 | tiny, but too many requests |\n| **64 MB** | **64** | **~10 s on LTE** ← chosen |\n| 256 MB | 16 | ~40 s, too much on weak signal |\n");
    await QC(H, "faq", pick(RVB), "Why hasn't my clip shown up yet?", "Trucks upload at the depot on Wi-Fi. A clip recorded today normally appears the next morning. If it's been 2 days, check the upload queue (see [[Re-queue a failed clip upload]]).");
    await QC(H, "command", pick(RVB), "uvicorn roadview.backend.api.main:app --reload");
    await QC(H, "link", pick(RVB), "RoadView API (test)", "Swagger page for the test API", "https://roadview-test.example.gov/docs");
    sub(H, [["| Dev  |       |\n| Prod |       |\n| Repo |       |", "| Dev  | https://roadview-test.example.gov |\n| Prod | https://roadview.example.gov |\n| Repo | `roadview/backend` in the demo repo |"]]);
    fill(H, "People", "- [[Sam Okafor]]: backend lead\n- [[Rita Gomez]]: main customer\n- [[Jordan Ellis]]: network / storage");
  }

  // ======================= RoadView Frontend & Inference =======================
  {
    const H = hub(RV, RVF), T = tasks(RV, RVF);
    prop(H, "next_action", "Review Lena's map clustering branch");
    leftOff(H, ["Paging and timestamp fixes are merged.", "Next: review `feature/map-clustering` from [[Lena Park]]."]);
    fill(T, "Tasks", `
- [x] Show clip times in the viewer's time zone 🌿 fix/clip-timestamp-tz ➕ 2026-11-18 ✅ 2026-11-19
- [ ] Review Lena's map clustering branch #sticky 🌿 feature/map-clustering 📅 2026-11-26 ➕ 2026-11-23`);
    await run("Meeting", [pick(RVF), "Map view demo", "2026-11-17", "15:30", "Lena Park, Rita Gomez"]);
    fill(meeting(RV, RVF, "2026-11-17", "Map view demo"), "Notes", "- Rita loved the map; wants to click a cluster and see those clips\n- Over 500 markers gets slow → clustering");
    await run("Issue", [pick(RVF), "Clip list page 2 repeats page 1", "medium", "Rita Gomez"]);
    const I = `${RV}/${RVF}/Issues/Clip list page 2 repeats page 1.md`;
    prop(I, "found", "2026-11-18"); prop(I, "status", "fixed"); prop(I, "fixed", "2026-11-20");
    fill(I, "Cause", "- The list always sent `page=1` to the API");

    const H2 = hub(RV, RVI), T2 = tasks(RV, RVI);
    prop(H2, "next_action", "Decide v8 vs v9 with Nina once the GPU quota is in");
    leftOff(H2, ["[[Nina Shah]]'s v9 results: better accuracy, still fits the nightly window at batch size 8."]);
    fill(T2, "Tasks", `
- [ ] Decide on YOLOv9 vs v8 for the nightly run 👤 [[Nina Shah]] 🌿 experiment/yolo-v9 🎯 FY2027 Q3 ➕ 2026-11-12`);
    await QC(H2, "waiting", pick(RVI), "GPU quota increase from [[Jordan Ellis]]", "2026-12-01");
    await run("Note", [pick(RVI), "Model comparison v8 vs v9"]);
    edit(`${RV}/${RVI}/Notes/Model comparison v8 vs v9.md`, s => s + "| Model | mAP50 | Frames/s (T4) | Nightly run |\n| ----- | ----- | ------------- | ----------- |\n| v8m (prod) | 0.71 | 41 | 2h20m |\n| v9c | 0.76 | 29 | 3h10m (window is 4h) |\n\nSource: `roadview/inference/experiments/yolo_v9.md` on `experiment/yolo-v9`.\n");
  }

  // ======================= Cloud Platform Operations =======================
  {
    const H = hub(CP, CPO), T = tasks(CP, CPO);
    fill(T, "Recurring", `
- [ ] Review the cloud cost report 🔁 every month on the 5th 📅 2026-12-05 ➕ 2026-08-01
- [ ] Rotate service API keys 🔁 every 3 months 📅 2027-01-10 ➕ 2026-10-10`);
    await QC(H, "request", pick(CPO), "GPU node for RoadView inference experiments", "Nina Shah", "2026-12-01");
    await run("Runbook", [pick(CPO), "Renew TLS certificates", "yearly", "Cloud", ""]);
    fill(`${CP}/${CPO}/Runbooks/Renew TLS certificates.md`, "Steps", "1. Generate a CSR on the load balancer.\n2. Submit through the service desk (link in General Docs & Links).\n3. Upload the cert bundle to the load balancer; check the expiry date in a browser.");
    await run("Issue", [pick(CPO), "Terraform plan shows bucket lifecycle drift", "low", "Sam Okafor"]);
    const I = `${CP}/${CPO}/Issues/Terraform plan shows bucket lifecycle drift.md`;
    prop(I, "found", "2026-11-20"); prop(I, "status", "fixed"); prop(I, "fixed", "2026-11-23");
    fill(I, "Cause", "- Provider bug in 6.10; fixed by Jordan's bump to 6.12");
    await QC(H, "aware", pick(CPO), "Never run `terraform apply` from a laptop. Plans are applied by the pipeline only.");
    await QC(H, "command", pick(CPO), "terraform -chdir=infra/terraform plan -var-file=prod.tfvars");
  }

  // ======================= SSO Migration =======================
  {
    const H = hub(CP, SSO), T = tasks(CP, SSO), D = `${CP}/${SSO}`;
    sub(H, [["status: active", "status: active\nreq_prefix: SSO"]]);
    prop(H, "started", "2026-11-16");
    prop(H, "next_action", "Work around the test IdP clock skew, then demo login to Dana");
    leftOff(H, [
      "SP config is on `feature/saml-sp-config`; AuthnRequests are signed (test cert).",
      "Test logins fail intermittently: [[Test IdP clock skew rejects assertions]].",
      "Waiting on [[Tom Becker]] for a prod IdP change window.",
    ]);
    fill(T, "Tasks", `
- [x] Register SP metadata with the test IdP 👤 [[Tom Becker]] 🌿 feature/saml-sp-config ➕ 2026-11-16 ✅ 2026-11-19
- [/] SAML SP config for the crash dashboard (test IdP) 🌿 feature/saml-sp-config 🎯 FY2027 Q2 📅 2026-12-09 ➕ 2026-11-16
- [ ] Pilot with Traffic Safety analysts 👤 [[Dana Whitfield]] 🎯 FY2027 Q3 ➕ 2026-11-16`);
    await QC(H, "waiting", pick(SSO), "Prod IdP change window from [[Tom Becker]]", "2026-12-02");
    await run("Meeting", [pick(SSO), "SSO kickoff", "2026-11-16", "13:00", "Tom Becker, Jordan Ellis"]);
    const K = meeting(CP, SSO, "2026-11-16", "SSO kickoff");
    fill(K, "Notes", "- Crash dashboard admin pages move off local accounts to SAML\n- MFA is enforced at the IdP, not in the app\n- Test IdP first; prod needs a change window (2 weeks' notice)");
    fill(K, "Decisions", "- 2026-11-16 — Crash dashboard is the first app on SAML — smallest user base, internal only");
    await run("Requirement", [pick(SSO), "MFA enforced at the IdP", "Every login goes through the agency IdP with MFA; the app keeps no passwords.", "must", "approved", pick("SSO kickoff"), DEF], { active: K });
    await run("Requirement", [pick(SSO), "Roles come from directory groups", "App roles are assigned from directory groups in the SAML assertion.", "must", "proposed", pick("SSO kickoff"), "Tom Becker"], { active: K });
    await run("Meeting", [pick(SSO), "Claims mapping review", "2026-11-23", "15:00", "Tom Becker, Jordan Ellis"]);
    const CM = meeting(CP, SSO, "2026-11-23", "Claims mapping review");
    fill(CM, "Notes", "- Groups claim works on the test IdP\n- Users in no mapped group should still see public pages → default role *viewer*\n- Saw intermittent *assertion not yet valid* errors (clock skew)");
    await run("Change Requirement", [pick(SSO), pick("SSO-REQ-002"), "all", "App roles are assigned from directory groups in the SAML assertion; users in no mapped group get the viewer role.", "approved", "must", "Analysts outside the groups still need read access", pick("Claims mapping review"), DEF], { target: "scratch.md", active: CM });
    await run("Issue", [pick(SSO), "Test IdP clock skew rejects assertions", "medium", "Tom Becker"]);
    const I = `${D}/Issues/Test IdP clock skew rejects assertions.md`;
    prop(I, "found", "2026-11-23"); prop(I, "status", "workaround");
    fill(I, "Symptoms", "- About 1 login in 5 fails with *assertion NotBefore is in the future*");
    fill(I, "Workaround", "- Allow 2 minutes of clock skew on the SP (`infra/sso/README.md`)");
    fill(I, "Fix", "- [ ] Ask Tom's team to fix NTP on the test IdP 📅 2026-12-01");
    sub(H, [["| Dev  |       |\n| Prod |       |\n| Repo |       |", "| Dev  | Test IdP: https://idp-test.example.gov |\n| Prod | Prod IdP (after change window) |\n| Repo | `infra/sso` in the demo repo |"]]);
  }

  // ======================= Knowledge Base =======================
  await run("Write-up", ["How the test IdP is set up", "setup", "SAML / Identity", `${SSO}, ${CP}`]);
  const W1 = "Knowledge Base/Write-ups/How the test IdP is set up.md";
  sub(W1, [["> [!summary] TL;DR\n> \n", "> [!summary] TL;DR\n> A throwaway SAML IdP for testing app logins without touching the real directory. Users and groups are defined in a YAML file; it restarts nightly.\n"]]);
  fill(W1, "Background", "- Apps moving to SAML ([[SSO Migration]]) need a safe place to test claims and roles.");
  fill(W1, "Prerequisites", "- Container host access (ask [[Jordan Ellis]])\n- The test signing cert from the vault");
  fill(W1, "Steps", "1. `docker compose up -d` in `idp-test/` (SimpleSAMLphp)\n2. Add test users and their groups to `idp-test/users.yaml`\n3. Import the SP's metadata (e.g. `infra/sso/sp-metadata.test.xml`)\n4. Rotate the signing cert yearly: [[Rotate the SAML signing certificate]]");
  fill(W1, "Config values", "| Setting | Value / location |\n| ------- | ---------------- |\n| URL | https://idp-test.example.gov |\n| Users | `idp-test/users.yaml` |\n| Restart | nightly 03:00 (wipes sessions) |");
  fill(W1, "Gotchas", "- Its clock drifts; allow 2 minutes of skew on the SP. See [[Test IdP clock skew rejects assertions]].");
  await QC(W1, "link", pick("This note"), "Test IdP metadata", "Import this into an SP to trust the test IdP", "https://idp-test.example.gov/saml2/idp/metadata.php");
  await run("Write-up", ["SAML claims cheat sheet", "system", "SAML / Identity", SSO]);
  const W2 = "Knowledge Base/Write-ups/SAML claims cheat sheet.md";
  sub(W2, [["> [!summary] TL;DR\n> \n", "> [!summary] TL;DR\n> Which attribute in the assertion carries what, and how our apps use it.\n"]]);
  fill(W2, "Components", "| Claim | Example | Used for |\n| --- | --- | --- |\n| NameID | arivera@example.gov | user key |\n| groups | CrashDashboard-Analysts | app roles |\n| displayName | Alex Rivera | header |");
  await run("Write-up", ["How the crash data pipeline works", "system", "Crash data", `${LOAD}, ${DASH}, ${CR}`]);
  const W3 = "Knowledge Base/Write-ups/How the crash data pipeline works.md";
  sub(W3, [["> [!summary] TL;DR\n> \n", "> [!summary] TL;DR\n> Police reports → e-crash portal → nightly load into `crash_rpt` → dashboard and FHWA extract. Yearly vendor extracts go through `crash_stg` first.\n"]]);
  fill(W3, "Data / request flow", "1. Officers file reports in the e-crash portal.\n2. Nightly job loads them into `crash_rpt` (CRASHPRD).\n3. Geocoding via LRS v2 (fallback: county + milepost).\n4. Dashboard reads `crash_rpt`; monthly FHWA extract runs on the 1st.");
  fill(W3, "Components", "| Component | Where | Notes |\n| --- | --- | --- |\n| e-crash portal | vendor-hosted | officers' entry point |\n| crash_rpt | CRASHPRD | source of truth |\n| crash_stg | CRASHDEV | yearly loads; wiped Sundays |\n| Dashboard | `crash-dashboard/app` | public |");
  await QC(W3, "doc", pick("This note"), "Pipeline architecture diagram", "Every hop from the e-crash portal to the dashboard", "\\\\fileserver\\CrashRecords\\Architecture\\pipeline.vsdx");
  await run("Write-up", ["Branch naming and code review", "policy", "Development", `${RV}, ${CR}`]);
  const W4 = "Knowledge Base/Write-ups/Branch naming and code review.md";
  fill(W4, "The rules", "- Branches: `feature/<what>`, `fix/<what>`, `experiment/<what>`; delete after merge\n- One reviewer for normal changes; two for auth or anything that deletes data\n- Put the branch on the task (`🌿 feature/<what>`) so it shows on the project hub");
  sub(W4, [["> [!summary] TL;DR\n> \n", "> [!summary] TL;DR\n> `feature/…`, `fix/…`, `experiment/…`. One reviewer for normal changes, two for anything touching auth or data deletion.\n"]]);
  await run("Write-up", ["Paper form retirement retrospective", "project", "Crash data", FORM]);
  const W5 = "Knowledge Base/Write-ups/Paper form retirement retrospective.md";
  fill(W5, "What I'd do differently", "- Start training the slowest agencies first\n- Turn off scanning only after 30 days with zero paper forms");
  sub(W5, [["> [!summary] TL;DR\n> \n", "> [!summary] TL;DR\n> Took 5 months, not 3. Training the last few agencies took the longest; start that first next time.\n"]]);
  await run("Runbook", [pick("Knowledge Base"), "Request a database account", "ad hoc", "Oracle", `${CR}`]);
  fill("Knowledge Base/Runbooks/Request a database account.md", "Steps", "1. Service desk → *Database access* form (link in General Docs & Links).\n2. Name the schema and read/write; attach the manager's approval.\n3. [[Priya Natarajan]] creates it, usually within 3 days.");
  await run("Runbook", [pick("Knowledge Base"), "Rotate the SAML signing certificate", "yearly", "SAML / Identity", `${SSO}`]);
  fill("Knowledge Base/Runbooks/Rotate the SAML signing certificate.md", "Steps", "1. Generate the new key pair; store it in the vault as `sso-sp-signing-<env>`.\n2. Publish new SP metadata with **both** certs.\n3. After the IdP picks it up (24 h), switch signing to the new cert.\n4. Remove the old cert from the metadata a week later.");

  // ======================= General Docs & Links, Sticky =======================
  const QG = (kind, ...a) => QC(hub(CR, LOAD), kind, pick("General Docs"), ...a);
  await QG("doc", "IT project intake form", "Start here for any new project request from a division", "https://sharepoint.example.gov/sites/it/Forms/Intake.docx", "Process");
  await QG("doc", "Oracle naming standards", "Table/column naming rules every new schema must follow", "\\\\fileserver\\IT\\Standards\\Oracle_Naming.pdf", "Oracle");
  await QG("link", "Service desk portal", "Access requests, certificates, server tickets", "https://servicedesk.example.gov", "Process");
  await QG("link", "Cloud console", "Tenancy console (read-only for most of us)", "https://cloud.example.gov/console", "Cloud");
  await QG("link", "Change advisory board calendar", "When prod changes can happen; book IdP changes 2 weeks out", "https://sharepoint.example.gov/sites/it/CAB", "Process");
  await run("Quick Capture", ["sticky", "Submit timesheet", "2026-11-25"], { target: "scratch.md" });
  await run("Quick Capture", ["sticky", "Book a room for the Dec 2 staging sign-off", ""], { target: "scratch.md" });
  await run("Quick Capture", ["sticky", "Reply to Carla about the November extract", ""], { target: "scratch.md" });

  // ======================= Repos + Git =======================
  const REPOS = [[hub(CR, CRO), "crash-dashboard/reports"], [hub(CR, LOAD), "crash-dashboard/etl"], [hub(CR, DASH), "crash-dashboard/app"],
                 [hub(RV, RVB), "roadview/backend"], [hub(RV, RVF), "roadview/frontend"], [hub(RV, RVI), "roadview/inference"],
                 [hub(CP, CPO), "infra/terraform"], [hub(CP, SSO), "infra/sso"]];
  for (const [h, dir] of REPOS) {
    sub(h, [["repo: []", `repo:\n  - ${GH}/tree/main/${dir}`]]);
    await run("Refresh Git", [], { target: "scratch.md", active: h });
  }

  // ======================= Daily notes =======================
  const LOG = {
    "2026-11-16": [`[[${LOAD}]] started the county-code validation query`, `[[${SSO}]] kickoff with Tom and Jordan; drafted SP metadata`, `[[${RVB}]] logged the clip timestamp issue Rita reported`, `[[${RVO}]] weekly upload-queue check: 2 stuck clips re-queued`],
    "2026-11-17": [`[[${DASH}]] added 2025 to the year filter`, `[[${RVB}]] resume-from-last-part logic for chunked uploads`, `[[${CRO}]] sent Marcus the work-zone crash numbers`, `[[${RVF}]] map view demo with Lena and Rita`],
    "2026-11-18": [`[[${LOAD}]] FIPS mapping; validation rules review with Marcus, Dana and Kevin`, `[[${RVB}]] UTC fix for clip timestamps`, "Half-day training: Oracle 23ai new features"],
    "2026-11-19": [`[[${LOAD}]] route ID validation against LRS v2`, `[[${SSO}]] groups-claim → role mapping; test IdP accepted our metadata`, `[[${CRO}]] Safety Committee data check-in`, `[[${RVO}]] added 6 new trucks for Rita`],
    "2026-11-20": [`[[${RVB}]] merged the timestamp fix; 48h session expiry`, `[[${RVB}]] retention policy check with Tom and Rita`, `[[${RVF}]] reviewed Lena's paging fix`],
    "2026-11-23": [`[[${CRO}]] fatal crash counts by county for Marcus`, `[[${LOAD}]] validation summary query`, `[[${RVO}]] fleet ops check-in with Rita`, `[[${SSO}]] claims mapping review; found the clock-skew issue`],
    "2026-11-24": [`[[${LOAD}]] validate.py runs all checks`, `[[${SSO}]] signed AuthnRequests on the test IdP`, `[[${CPO}]] reviewed Jordan's provider bump`],
  };
  for (const [day, lines] of Object.entries(LOG)) {
    await run("Daily Note", [], { target: `Daily/${day}.md` });
    sub(`Daily/${day}.md`, [[/(## Log\n.*\n)- \n/, `$1${lines.map(l => `- ${l}`).join("\n")}\n`]]);
  }

  // ======================= Git Activity page + weekly reviews =======================
  await run("Refresh Git", [], { target: "scratch.md", active: "Git Activity.md" });
  await run("Weekly Report", [1]);
  await run("Weekly Report", [0]);
  fs.rmSync(path.join(V, "scratch.md"), { force: true });
  fs.rmSync(path.join(V, "Untitled.md"), { force: true });
  console.log("SHOWCASE OK");
})().catch(e => { console.error("FAIL", e); process.exit(1); });
