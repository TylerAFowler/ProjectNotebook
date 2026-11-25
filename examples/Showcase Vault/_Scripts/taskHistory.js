// Templater user script: tp.user.taskHistory() → the "📜 History" section for a project's Tasks note:
// a collapsed box (click to open, works in Reading view) listing done and cancelled tasks, newest first.
function taskHistory() {
  return [
    "## 📜 History",
    "> [!example]- ✅ Done and ❌ cancelled tasks (click to show / hide)",
    "> ```tasks",
    "> (status.type is DONE) OR (status.type is CANCELLED)",
    "> path includes {{query.file.folder}}",
    "> group by status.name",
    "> sort by done reverse",
    "> short mode",
    "> ```",
    "",
  ].join("\n");
}
module.exports = taskHistory;
