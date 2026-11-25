<%*
try {
// Run with "Project Notes: Quick capture" from ANY note (or its button / hotkey).
// It inserts nothing where your cursor is; it appends to the chosen project instead.
const kind = await tp.system.suggester(
  ["✅ Task (one-off or recurring)", "📬 Request from someone", "⏳ Waiting on someone", "✅ Decision", "⚠️ Thing to be aware of", "💻 Helpful command", "❓ FAQ entry", "📄 Document", "🌐 Link", "📅 Deliverable (schedule)"],
  ["task", "request", "waiting", "decision", "aware", "command", "faq", "doc", "link", "deliverable"], false, "Capture what?");
if (!kind) throw new Error("Cancelled.");
const act = tp.config.active_file;
const actType = act ? tp.app.metadataCache.getFileCache(act)?.frontmatter?.type : null;
const thisNote = (kind === "doc" || kind === "link") && (actType === "runbook" || actType === "writeup");
const proj = await tp.user.pickProject(tp, kind === "doc" || kind === "link",
  thisNote ? [{ label: `📘 This note: ${act.basename}`, value: "__this__" }] : []);
const onThis = proj === "__this__";
const general = proj === "__general__";
const ask = async (q, def = "") => { const a = (await tp.system.prompt(q, def))?.trim(); if (!a) throw new Error("Cancelled."); return a; };
const text = await ask(
  kind === "faq" ? "Question" :
  kind === "waiting" ? "What are you waiting on, and from whom? (e.g. schema approval from [[Jane Doe]])" :
  kind === "doc" ? "Document name" : kind === "link" ? "Link name" :
  kind === "request" ? "What was requested?" : kind === "deliverable" ? "Deliverable (e.g. Monthly FHWA crash extract)" : "Text");
const today = tp.date.now("YYYY-MM-DD");
const vlt = tp.app;

// "Jane Doe, [[Bob Smith]]" → " 👤 [[Jane Doe]] 👤 [[Bob Smith]]" (people waiting on / to notify about a task)
const peopleMarks = s => (s || "").split(",").map(x => x.trim().replace(/^👤\s*/, "").replace(/^\[\[|\]\]$/g, "")).filter(Boolean).map(n => ` 👤 [[${n}]]`).join("");

// Table cells: escape pipes; show file paths as code, URLs as-is (clickable).
const cell = v => v.replace(/\|/g, "\\|");
const loc = v => /^(https?|file):\/\//i.test(v) ? v.replace(/ /g, "%20") : "`" + v.replace(/`/g, "'") + "`";
const GENERAL = "General Docs & Links.md";

// Insert `line` at the end of the "## " section whose heading contains `headingWord` (or append to the file).
// If the section doesn't exist and `newSection` is given, it is inserted before "Things to be aware of".
const addToSection = async (file, headingWord, line, newSection = null) => {
  await vlt.vault.process(file, data => {
    const lines = data.split("\n");
    const h = lines.findIndex(l => /^## /.test(l) && l.toLowerCase().includes(headingWord.toLowerCase()));
    if (h < 0 && newSection) {
      let at = lines.findIndex(l => /^## .*aware/i.test(l));
      if (at < 0) at = lines.length;
      lines.splice(at, 0, ...newSection.split("\n"), line, "");
      return lines.join("\n");
    }
    if (h < 0) return data.replace(/\n*$/, "\n") + line + "\n";
    let end = lines.findIndex((l, i) => i > h && /^#{1,6} /.test(l));
    if (end < 0) end = lines.length;
    // Skip back over blank lines and the template's empty "- " placeholder.
    let at = end;
    // (Placeholders: an empty "- ", "- [ ] ", or an empty table row "|   |   |".)
    const blank = /^\s*(- \[ \] |- |(\|\s*){2,})?\s*$/, ph = /^\s*(- \[ \] |- |(\|\s*){2,})\s*$/;
    while (at > h + 1 && blank.test(lines[at - 1])) at--;
    const placeholder = lines.slice(at, end).findIndex(l => ph.test(l));
    if (placeholder >= 0) lines.splice(at + placeholder, 1, line);
    else lines.splice(at, 0, line);
    return lines.join("\n");
  });
};

if (kind === "task" || kind === "waiting" || kind === "request") {
  const tasksFile = vlt.vault.getAbstractFileByPath(`${proj.parent.path}/${proj.basename} - Tasks.md`) ?? proj;
  if (kind === "request") {
    const who = peopleMarks(await tp.system.prompt("Who asked / is waiting on it? (names, comma-separated)", ""));
    const due = (await tp.system.prompt("Needed by (YYYY-MM-DD, blank for none)", ""))?.trim();
    const line = `- [ ] #request ${text}${who}${due ? ` 📅 ${due}` : ""} ➕ ${today}`;
    // Operations Tasks notes have a "## Requests" section; projects fall back to "## Tasks".
    const hasRequests = (await vlt.vault.cachedRead(tasksFile)).includes("\n## Requests");
    await addToSection(tasksFile, hasRequests ? "Requests" : "Tasks", line);
  } else {
    const repeat = kind === "task" ? (await tp.system.prompt("Repeats? Blank = one-off. e.g. every month on the 1st · every week on Monday · every 3 months", ""))?.trim() : "";
    const due = (await tp.system.prompt(kind === "waiting" ? "Follow-up date (YYYY-MM-DD, blank for none)" : repeat ? "First due date (YYYY-MM-DD), needed for repeats" : "Due date (YYYY-MM-DD, blank for none)", ""))?.trim();
    const est = kind === "task" ? (await tp.system.prompt("Estimated completion (optional): YYYY-MM-DD or FY2027 Q2", ""))?.trim().replace(/^🎯\s*/, "") : "";
    if (est && !/^(\d{4}-\d{2}-\d{2}|FY\d{4} Q[1-4])$/i.test(est)) throw new Error(`Estimated completion "${est}" should be YYYY-MM-DD or like FY2027 Q2.`);
    const prio = kind === "task" ? await tp.system.suggester(["Normal", "⏫ High", "🔼 Medium", "🔽 Low"], ["", " ⏫", " 🔼", " 🔽"], false, "Priority") ?? "" : "";
    const rec = repeat ? ` 🔁 ${repeat.replace(/^🔁\s*/, "")}` : "";
    const branch = kind === "task" ? (await tp.system.prompt("Git branch for this task (optional, e.g. feature/sso-login)", ""))?.trim().replace(/^🌿\s*/, "") : "";
    const forWho = kind === "task" ? peopleMarks(await tp.system.prompt("Who's waiting on this / should be told when it's done? (names, comma-separated, optional)", "")) : "";
    const line = `- [ ] ${kind === "waiting" ? "#waiting " : ""}${text}${forWho}${branch ? ` 🌿 ${branch}` : ""}${est ? ` 🎯 ${est.toUpperCase().replace(/^FY(\d{4}) Q/, "FY$1 Q")}` : ""}${prio}${rec}${due ? ` 📅 ${due}` : ""} ➕ ${today}`;
    const hasRecurring = repeat && (await vlt.vault.cachedRead(tasksFile)).includes("\n## Recurring");
    await addToSection(tasksFile, hasRecurring ? "Recurring" : "Tasks", line);
  }
} else if (kind === "decision") {
  await addToSection(proj, "Decisions", `- ${today} — ${text}`);
} else if (kind === "aware") {
  await addToSection(proj, "aware", `- ${text}`);
} else if (kind === "faq") {
  const answer = (await tp.system.prompt("Answer (you can expand it later)", "", false, true)) ?? "";
  const faqPath = `${proj.parent.path}/${proj.basename} - FAQ.md`;
  let faq = vlt.vault.getAbstractFileByPath(faqPath);
  if (!faq) {
    faq = await vlt.vault.create(faqPath, tp.user.faqNote(proj.basename));
    // Link the new FAQ from the hub, right under its title.
    await vlt.vault.process(proj, d => d.replace(/^(# .*)$/m, `$1\n❓ [[${proj.basename} - FAQ|FAQ]]`));
  }
  const body = answer.split("\n").map(l => `> ${l}`).join("\n");
  await addToSection(faq, "Questions", `\n> [!faq]- ${text}\n${body}\n> *Updated ${today}*\n`);
} else if (kind === "doc" || kind === "link") {
  const why = await ask("One line: what is it / why is it useful?");
  const where = await ask(kind === "doc" ? "Location (file path, share path, SharePoint/Drive URL…)" : "URL", kind === "link" ? "https://" : "");
  if (onThis) {
    await addToSection(act, kind === "doc" ? "documents" : "links", `| ${cell(text)} | ${cell(why)} | ${loc(where)} |`);
  } else if (general) {
    const topic = (await tp.system.prompt("Topic (optional, e.g. Oracle, GIS, HR)", ""))?.trim() || "";
    let gfile = vlt.vault.getAbstractFileByPath(GENERAL);
    if (!gfile) throw new Error(`Can't find ${GENERAL} at the top of the vault.`);
    await addToSection(gfile, kind === "doc" ? "Documents" : "Links", `| ${cell(text)} | ${cell(topic)} | ${cell(why)} | ${loc(where)} |`);
  } else {
    await addToSection(proj, kind === "doc" ? "documents" : "links", `| ${cell(text)} | ${cell(why)} | ${loc(where)} |`);
  }
} else if (kind === "deliverable") {
  const to = (await tp.system.prompt("Recipient (person/team/agency)", ""))?.trim() || "";
  const freq = (await tp.system.prompt("Frequency (e.g. Monthly, by the 5th)", ""))?.trim() || "";
  const rb = (await tp.system.prompt("Runbook note name (optional, e.g. Monthly FHWA crash export)", ""))?.trim();
  await addToSection(proj, "Deliverables", `| ${cell(text)} | ${cell(to)} | ${cell(freq)} | ${rb ? `[[${rb}]]` : ""} |`,
    "## 📅 Deliverables schedule\n| Deliverable | Recipient | Frequency | Runbook |\n| ----------- | --------- | --------- | ------- |");
} else {
  await addToSection(proj, "commands", `- \`${text}\``);
}
new tp.obsidian.Notice(`Added to ${onThis ? act.basename : general ? "General Docs & Links" : proj.basename}`);
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
-%>
