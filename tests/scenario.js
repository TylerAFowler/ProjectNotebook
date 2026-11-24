const { run } = require("./harness");
const pickFirst = (_ph, labels, values) => values[0];
(async () => {
  await run("New Project", ["__new__", "Crash Database", "__done__", "Example Project", true]);
  await run("New Operations", ["Crash Database", "__done__", "Crash Database Operations", false, false]);
  await run("Person", ["Jane Doe"]);
  await run("Person", ["Bob Smith"]);
  const P = "Crash Database/Example Project/Example Project.md";
  await run("Meeting", [pickFirst, "Kickoff", "2026-11-23", "", "Jane Doe, Bob Smith"], { active: P });
  await run("Meeting", [pickFirst, "Staging load review", "2026-12-08", "10:00", ""], { active: P });
  const M1 = "Crash Database/Example Project/Meetings/2026-11-23 Kickoff.md";
  const pickMeeting1 = (_ph, labels, values) => values[0];
  await run("Requirement", [pickFirst, "County codes validated", "Every crash record's county code must match the state county list before loading to prod.", "must", "proposed", pickMeeting1, "Jane Doe, Bob Smith"], { active: M1 });
  await run("Requirement", [pickFirst, "Dashboard shows 2025 data", "The public dashboard includes 2025 crash data by mid-December.", "should", "approved", (_p, l, v) => v[v.length - 1], "Bob Smith"], { active: P });
  await run("Meeting", [pickFirst, "Requirements review", "2026-11-24", "14:00", "Jane Doe"], { active: P });
  const M2 = "Crash Database/Example Project/Meetings/2026-11-24 Requirements review.md";
  const R1 = "Crash Database/Example Project/Requirements/EP-REQ-001 County codes validated.md";
  await run("Change Requirement", [pickFirst, (_p, l, v) => v[0], "all", "Every crash record's county code must match the state county list | FIPS codes before loading to staging.", "approved", "must", "Catch bad codes earlier", (_p, l, v) => v[0], "Jane Doe"], { target: "scratch.md", active: M2 }).catch(e => { throw e; });
  await run("Issue", [pickFirst, "Geocoding fails on null route ID", "high", "Bob Smith, Jane Doe"], { active: P });
  await run("Note", [pickFirst, "Data load runbook"], { active: P });
  const QC = ([k, ...a], pick = pickFirst) => run("Quick Capture", [k, pick, ...a], { target: "scratch.md", active: P });
  await QC(["task", "Load 2025 crash records into staging", "", "2026-12-05", "", " ⏫", "", "Bob Smith"]);
  await QC(["task", "Write validation queries for county codes", "", "", "2027-01-15", "", "", ""]);
  const pickOps = (_ph, labels, values) => values[labels.findIndex(l => l.includes("Operations"))];
  await QC(["task", "Generate FHWA monthly crash export", "every month on the 1st", "2026-12-01", "", "", "", "FHWA Liaison"], pickOps);
  await QC(["request", "2025 fatal crash counts by county", "Bob Smith", "2026-11-30"], pickOps);
  await QC(["deliverable", "Monthly FHWA crash extract", "FHWA", "Monthly, by the 5th", "Monthly FHWA crash export"], pickOps);
  await QC(["command", "sqlplus crash_rpt@PRODDB @fhwa_extract.sql"], pickOps);
  await run("Runbook", [pickOps, "Monthly FHWA crash export", "monthly", "Crash data", ""], { active: P });
  const pickFirstVal = (_ph, labels, values) => values[0];
  await run("Runbook", [pickFirstVal, "Example KB runbook - request database access", "ad hoc", "Oracle", "Crash Database"]);
  await run("Write-up", ["Example write-up - how the crash data pipeline works", "system", "Crash data", "Example Project, Crash Database"]);
  const W = "Knowledge Base/Write-ups/Example write-up - how the crash data pipeline works.md";
  await run("Quick Capture", ["doc", pickFirstVal, "Pipeline architecture diagram", "Visio of every hop from vendor SFTP to the dashboard", "\\\\fileserver\\CrashDB\\Architecture\\pipeline.vsdx"], { target: "scratch.md", active: W });
  await QC(["waiting", "Schema change approval from [[Jane Doe]]", "2026-11-27"]);
  await QC(["decision", "Use LRS v2 endpoint for route lookups — v1 is retired in March"]);
  await QC(["aware", "Staging DB is refreshed from prod every Sunday night; don't leave test data there"]);
  await QC(["command", "sqlplus crash_stg@STGDB @load_2025.sql"]);
  await QC(["faq", "How often is the crash data refreshed?", "Nightly at 2 AM from the state crash reporting system."]);
  const pickGeneral = (_ph, labels, values) => values[values.length - 1];
  await QC(["doc", "2025 crash extract field list", "Every field in the vendor extract with types; use when mapping to staging", "\\\\fileserver\\CrashDB\\Specs\\2025_extract_fields.xlsx"]);
  await QC(["doc", "Schema change request", "The approved change request for the new county | route columns", "https://sharepoint.example.gov/sites/crash/Shared Documents/CR-1042.docx"]);
  await QC(["link", "Staging dashboard", "Check row counts after each load", "https://dashboards.example.gov/crash-staging"]);
  await QC(["doc", "Oracle naming standards", "Table/column naming rules all new schemas must follow", "\\\\fileserver\\IT\\Standards\\Oracle_Naming.pdf", "Oracle"], pickGeneral);
  await QC(["link", "Service desk portal", "Where to open access requests and server tickets", "https://servicedesk.example.gov", ""], pickGeneral);
  await run("Quick Capture", ["sticky", "Call Bob back about the extract", "2026-11-24"], { target: "scratch.md", active: P });
  await run("Quick Capture", ["sticky", "Order new monitor", ""], { target: "scratch.md", active: P });
  await run("Daily Note", [], { target: "Daily/2026-11-23.md" });
  await run("Daily Note", [], { target: "Daily/2026-11-24.md" });
  await module.exports.fill();
})().catch(e => { console.error("FAIL", e); process.exit(1); });

// ---- Fill in realistic sample content, then generate the weekly report ----
const fs = require("fs"), path = require("path");
const V = process.argv[2], P = "Crash Database/Example Project";
const edit = (rel, fn) => fs.writeFileSync(path.join(V, rel), fn(fs.readFileSync(path.join(V, rel), "utf8")));
module.exports.fill = async () => {
  const { run } = require("./harness");
  edit(`${P}/Example Project - Tasks.md`, s => s
    .replace("- [ ] Write validation queries for county codes 🎯 2027-01-15 ➕ 2026-11-24", "- [/] Write validation queries for county codes 🎯 2027-01-15 ➕ 2026-11-24")
    .replace("## Tasks\n", "## Tasks\n- [x] Get read access to the staging database 👤 [[Jane Doe]] ➕ 2026-11-20 ✅ 2026-11-23\n- [-] Evaluate LRS v1 endpoint ➕ 2026-11-20 ❌ 2026-11-23\n"));
  edit(`${P}/Example Project.md`, s => s
    .replace("next_action: ", "next_action: Finish county-code validation queries")
    .replace("> - \n", "> - Validation queries for county codes are half done (see Notes/Data load runbook).\n> - Next: run them against the 2025 staging load, then send results to [[Jane Doe]].\n")
    .replace("## 👥 People\n- ", "## 👥 People\n- [[Jane Doe]]: DBA, approves schema changes\n- [[Bob Smith]]: business owner"));
  edit(`${P}/Meetings/2026-11-23 Kickoff.md`, s => s
    .replace("## Agenda\n- ", "## Agenda\n- Scope of the 2025 data load\n- Who signs off on schema changes")
    .replace("## Notes\n- ", "## Notes\n- Bob needs 2025 data in the dashboard by mid-December\n- Jane will review the proposed schema change this week")
    .replace("## Decisions\n*Format: `- YYYY-MM-DD — decision — why`. Copy the important ones to the project hub too.*\n- ",
             "## Decisions\n*Format: `- YYYY-MM-DD — decision — why`. Copy the important ones to the project hub too.*\n- 2026-11-23 — Load 2025 data into staging first — lets Bob's team validate before prod")
    .replace("## Action items\n*Write as tasks (add `📅 date` for a due date). They roll up to the project hub automatically.*\n- [ ] ",
             "## Action items\n*Write as tasks (add `📅 date` for a due date). They roll up to the project hub automatically.*\n- [ ] Send Bob the list of fields in the 2025 extract 📅 2026-11-26 ➕ 2026-11-23"));
  edit(`${P}/Issues/Geocoding fails on null route ID.md`, s => s
    .replace("found: 2026-11-24", "found: 2026-11-23")
    .replace("## Symptoms\n- ", "## Symptoms\n- About 3% of crash records get no lat/long when the route ID is null")
    .replace("## Workaround\n- ", "## Workaround\n- Fall back to the county + milepost lookup"));
  edit(`${P}/Notes/Data load runbook.md`, s => s + "1. Truncate staging tables\n2. Run `load_2025.sql`\n3. Run validation queries\n");
  edit("Daily/2026-11-23.md", s => s.replace(/(## Log\n.*\n)- \n/, "$1- [[Example Project]] kickoff with Jane and Bob; agreed on staging-first approach\n- [[Example Project]] logged the null-route geocoding issue\n- Answered helpdesk questions about the old crash report form\n"));
  edit("Daily/2026-11-24.md", s => s.replace(/(## Log\n.*\n)- \n/, "$1- [[Example Project]] started county-code validation queries\n"));
  await run("Weekly Report", [0]);
};
