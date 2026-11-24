// Templater user script: tp.user.req(tp, action, opts): helpers for requirement notes.
//   "nextId"      { hub }                  → next ID for the project, e.g. "EP-REQ-004"
//   "pickMeeting" { hub, prefer }          → a meeting TFile of that project (or null for "none")
//   "pickReq"     { hub, prefer }          → a requirement TFile of that project
//   "people"      { text, meeting }        → ["[[A]]", "[[B]]"] from comma text (defaults: meeting attendees)
//   "dateFor"     { meeting }              → the meeting's date (if not in the future), else today
//   "row"         { cells: [...] }         → a Markdown table row with pipes escaped
//   "addRow"      { file, row }            → appends a row to the "Version history" table
//   "setSection"  { file, heading, text }  → replaces the body of a "## <heading>" section
async function req(tp, action, o = {}) {
  const app = tp.app;
  const fmOf = f => app.metadataCache.getFileCache(f)?.frontmatter ?? {};
  const inProject = (f, hub) => f.path.startsWith(hub.parent.path + "/");
  const linkName = v => String(v ?? "").replace(/^\[\[|\]\]$/g, "").split("|")[0];
  const dateOf = v => (v instanceof Date ? window.moment(v).format("YYYY-MM-DD") : String(v ?? "").slice(0, 10));

  if (action === "nextId") {
    const hub = o.hub, fm = fmOf(hub);
    const prefix = (fm.req_prefix && String(fm.req_prefix).trim()) ||
      (hub.basename.match(/[A-Za-z0-9]+/g) || ["P"]).map(w => /^\d/.test(w) ? w : w[0]).join("").toUpperCase().slice(0, 6);
    const max = app.vault.getMarkdownFiles()
      .filter(f => inProject(f, hub) && fmOf(f).type === "requirement")
      .map(f => Number((String(fmOf(f).req_id ?? "").match(/(\d+)$/) || [0, 0])[1]))
      .reduce((a, b) => Math.max(a, b), 0);
    return `${prefix}-REQ-${String(max + 1).padStart(3, "0")}`;
  }

  if (action === "pickMeeting") {
    const meetings = app.vault.getMarkdownFiles()
      .filter(f => inProject(f, o.hub) && fmOf(f).type === "meeting")
      .sort((a, b) => dateOf(fmOf(b).date).localeCompare(dateOf(fmOf(a).date)));
    const prefer = o.prefer && fmOf(o.prefer).type === "meeting" && inProject(o.prefer, o.hub) ? o.prefer : null;
    const list = prefer ? [prefer, ...meetings.filter(f => f !== prefer)] : meetings;
    const labels = [...list.map(f => `🗓️ ${f.basename}${f === prefer ? "  (current note)" : ""}`), "— No meeting —"];
    const pick = await tp.system.suggester(labels, [...list, "__none__"], false, "Which meeting did this come from?");
    return pick && pick !== "__none__" ? pick : null;
  }

  if (action === "pickReq") {
    const reqs = app.vault.getMarkdownFiles()
      .filter(f => inProject(f, o.hub) && fmOf(f).type === "requirement")
      .sort((a, b) => String(fmOf(a).req_id).localeCompare(String(fmOf(b).req_id)));
    if (!reqs.length) throw new Error(`${o.hub.basename} has no requirements yet. Create one with the Requirement template.`);
    const pick = await tp.system.suggester(reqs.map(f => `${f.basename} [${fmOf(f).status ?? "?"} · v${fmOf(f).version ?? 1}]`), reqs, false, "Which requirement changed?");
    if (!pick) throw new Error("Cancelled.");
    return pick;
  }

  if (action === "people") {
    const def = o.meeting ? [].concat(fmOf(o.meeting).attendees ?? []).map(linkName).filter(Boolean).join(", ") : "";
    const text = o.text ?? (await tp.system.prompt("Who was involved / requested it? (comma-separated, optional)", def)) ?? "";
    return text.split(",").map(s => linkName(s.trim())).filter(Boolean).map(n => `[[${n}]]`);
  }

  if (action === "dateFor") {
    const today = window.moment().format("YYYY-MM-DD");
    const d = o.meeting ? dateOf(fmOf(o.meeting).date) : "";
    return /^\d{4}-\d{2}-\d{2}$/.test(d) && d <= today ? d : today;
  }

  if (action === "row") return "| " + o.cells.map(c => String(c ?? "").replace(/\r?\n+/g, " ").replace(/\|/g, "\\|").trim()).join(" | ") + " |";

  if (action === "addRow") {
    await app.vault.process(o.file, d => {
      const lines = d.split("\n");
      const h = lines.findIndex(l => /^## .*version history/i.test(l));
      if (h < 0) return d.replace(/\n*$/, "\n\n") + "## Version history\n| Ver | Date | Change | Why | Meeting | Who |\n| --- | ---- | ------ | --- | ------- | --- |\n" + o.row + "\n";
      let end = lines.findIndex((l, i) => i > h && /^#{1,6} /.test(l));
      if (end < 0) end = lines.length;
      let last = -1;
      for (let i = h + 1; i < end; i++) if (/^\|/.test(lines[i])) last = i;
      lines.splice(last >= 0 ? last + 1 : end, 0, o.row);
      return lines.join("\n");
    });
    return;
  }

  if (action === "setSection") {
    await app.vault.process(o.file, d => {
      const lines = d.split("\n");
      const h = lines.findIndex(l => new RegExp(`^## .*${o.heading}`, "i").test(l));
      if (h < 0) return d;
      let end = lines.findIndex((l, i) => i > h && /^#{1,6} /.test(l));
      if (end < 0) end = lines.length;
      lines.splice(h + 1, end - h - 1, o.text, "");
      return lines.join("\n");
    });
    return;
  }
  throw new Error(`Unknown req action "${action}"`);
}
module.exports = req;
