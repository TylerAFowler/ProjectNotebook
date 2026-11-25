<%*
try {
// Record a change to a requirement: bumps the version, updates wording/status/priority,
// adds a Version history row, and links the meeting + people.
// Run with "Project Notes: Change requirement" (or its button) while on the requirement note,
// or while in a meeting note (that meeting is linked automatically). Inserts nothing at your cursor.
const app = tp.app, act = tp.config.active_file;
const fmOf = f => app.metadataCache.getFileCache(f)?.frontmatter ?? {};
let reqFile = act && fmOf(act).type === "requirement" ? act : null;
let hub;
if (reqFile) {
  const pname = String(fmOf(reqFile).project ?? "").replace(/^\[\[|\]\]$/g, "");
  hub = app.vault.getMarkdownFiles().find(f => f.basename === pname && fmOf(f).type === "project");
}
if (!hub) hub = await tp.user.pickProject(tp);
if (!reqFile) reqFile = await tp.user.req(tp, "pickReq", { hub });
const fm = fmOf(reqFile);
const body = await app.vault.read(reqFile);
const cur = (body.match(/## Current requirement\n([\s\S]*?)(?=\n## |$)/) || [, ""])[1].trim();

const what = await tp.system.suggester(["Wording / scope changed", "Status only", "Priority only", "Wording + status/priority"], ["text", "status", "priority", "all"], false, `What changed in ${fm.req_id}?`);
if (!what) throw new Error("Cancelled.");
let text = cur, status = fm.status, priority = fm.priority;
if (what === "text" || what === "all") text = ((await tp.system.prompt("New wording (edit the current text)", cur, false, true)) ?? cur).trim();
if (what === "status" || what === "all") {
  const opts = ["proposed", "approved", "implemented", "deferred", "dropped"];
  status = await tp.system.suggester(opts.map(s => s === fm.status ? `${s} (current)` : s), opts, false, "New status") || fm.status;
}
if (what === "priority" || what === "all") {
  const opts = ["must", "should", "could", "won't"];
  priority = await tp.system.suggester(opts.map(s => s === fm.priority ? `${s} (current)` : s), opts, false, "New priority") || fm.priority;
}
const changes = [];
if (text !== cur) changes.push(`Wording: was "${cur.length > 300 ? cur.slice(0, 300) + "…" : cur}" → now "${text.length > 300 ? text.slice(0, 300) + "…" : text}"`);
if (status !== fm.status) changes.push(`Status: ${fm.status} → ${status}`);
if (priority !== fm.priority) changes.push(`Priority: ${fm.priority} → ${priority}`);
if (!changes.length) throw new Error("Nothing changed, so no new version was recorded.");
const why = (await tp.system.prompt("Why did it change? (optional)", "")) ?? "";
const meeting = await tp.user.req(tp, "pickMeeting", { hub, prefer: act });
const people = await tp.user.req(tp, "people", { meeting });
const today = await tp.user.req(tp, "dateFor", { meeting });  // meeting date when recorded from a meeting
const version = Number(fm.version ?? 1) + 1;
const mLink = meeting ? `[[${meeting.basename}]]` : "";

if (text !== cur) await tp.user.req(tp, "setSection", { file: reqFile, heading: "Current requirement", text });
await tp.user.req(tp, "addRow", { file: reqFile, row: await tp.user.req(tp, "row", { cells: [`v${version}`, today, changes.join("; "), why, mLink, people.join(", ")] }) });
await app.fileManager.processFrontMatter(reqFile, f => {
  f.version = version; f.status = status; f.priority = priority; f.last_changed = today;
  const add = (k, xs) => { const have = [].concat(f[k] ?? []); for (const x of xs) if (!have.includes(x)) have.push(x); f[k] = have; };
  if (mLink) add("meetings", [mLink]);
  add("people", people);
});
new tp.obsidian.Notice(`${fm.req_id} → v${version}: ${changes.map(c => c.split(":")[0]).join(", ")}`, 6000);
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
-%>
