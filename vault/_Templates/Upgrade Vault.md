<%*
try {
// Repairs notes made by older versions of the templates. Safe to run any number of times:
// each fix only changes text that is exactly the old, known-bad version. Run it after updating.
// Ctrl+P → "Project Notes: Upgrade vault" from any note.
const vlt = tp.app.vault;
// Each fix: { name, apply(text, frontmatter) → new text }. Must change nothing when already applied.
const FIXES = [
  { // 2026-11-25: "<branch>/<folder>" in the Git hint was read as unclosed HTML and broke Live Preview below it.
    name: "Git hint breaking edit mode",
    apply: t => t.split("(use a /tree/<branch>/<folder> URL to limit to a folder)").join("(use a `/tree/branch/folder` URL to limit to a folder)"),
  },
  { // 2026-11-25: Tasks notes get a "📜 History" box (done + cancelled tasks, click to expand) for Reading view.
    name: "📜 History box on Tasks notes",
    apply: (t, fm) => fm?.type !== "tasks" || t.includes("\n## 📜 History") ? t : t.replace(/\n*$/, "\n\n") + tp.user.taskHistory(),
  },
  { // 2026-11-25: action buttons (Project Notes plugin) under the title of project/operations/category hubs.
    name: "Buttons on hubs",
    apply: (t, fm) => {
      const ids = fm?.type === "project" ? (fm.kind === "operations" ? "quick-capture new-meeting new-issue new-runbook refresh-git" : "quick-capture new-meeting new-issue new-note new-requirement refresh-git")
        : fm?.type === "category" ? "new-project new-operations" : null;
      if (!ids || t.includes("```actions")) return t;
      return t.replace(/^(# .*\n(?:❓ \[\[.*\n)?)/m, `$1\`\`\`actions\n${ids}\n\`\`\`\n`);
    },
  },
];
const counts = FIXES.map(() => 0);
for (const f of vlt.getMarkdownFiles()) {
  if (f.path.startsWith("_Templates/") || f.path.startsWith("_Scripts/")) continue;
  const fm = tp.app.metadataCache.getFileCache(f)?.frontmatter;
  const before = await vlt.cachedRead(f);
  let after = before;
  FIXES.forEach((x, i) => { const n = x.apply(after, fm); if (n !== after) { counts[i]++; after = n; } });
  if (after !== before) await vlt.process(f, () => after);
}
const summary = FIXES.map((x, i) => `${x.name}: ${counts[i]} note${counts[i] === 1 ? "" : "s"} fixed`).join("\n");
new tp.obsidian.Notice(`Upgrade Vault\n${summary}`, 10000);
console.log("Upgrade Vault", summary);
} catch (e) {
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
