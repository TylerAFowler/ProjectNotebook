/* Project Notes: clean commands, an actions menu and on-page buttons for this vault.
 * It doesn't do the work itself: each action runs one of the vault's Templater templates (in _Templates),
 * opens a note, or calls another plugin's command. Needs the Templater plugin.
 *
 *   Commands:  Ctrl/Cmd+P → "Project Notes: New meeting", "Project Notes: Quick capture", …
 *   Menu:      the ribbon icon (left sidebar) lists every action.
 *   Buttons:   a code block in any note:
 *                ```actions
 *                quick-capture new-meeting new-issue refresh-git
 *                ```
 */
const obsidian = require("obsidian");
const { Plugin, Notice, Menu, Modal, Setting, TFile, MarkdownView, setIcon, normalizePath } = obsidian;

// kind: "create" = new note from a template · "run" = run a template on the current note (it adds content
// elsewhere, e.g. Quick Capture) · "open" = open a note · "command" = another plugin's command · "fn" = built in
const ACTIONS = [
  { id: "quick-capture", name: "Quick capture", label: "Quick capture", icon: "zap", kind: "run", template: "Quick Capture", group: "Capture" },
  { id: "log-friction", name: "Log friction", label: "Log friction", icon: "message-square-warning", kind: "fn", group: "Capture" },
  { id: "edit-task", name: "Edit task under cursor", label: "Edit task", icon: "square-pen", kind: "command", command: "obsidian-tasks-plugin:edit-task", group: "Capture" },

  { id: "new-meeting", name: "New meeting", label: "Meeting", icon: "calendar-plus", kind: "create", template: "Meeting", group: "New" },
  { id: "new-issue", name: "New issue", label: "Issue", icon: "bug", kind: "create", template: "Issue", group: "New" },
  { id: "new-note", name: "New note", label: "Note", icon: "file-plus", kind: "create", template: "Note", group: "New" },
  { id: "new-requirement", name: "New requirement", label: "Requirement", icon: "list-checks", kind: "create", template: "Requirement", group: "New" },
  { id: "change-requirement", name: "Change requirement", label: "Change requirement", icon: "git-compare", kind: "run", template: "Change Requirement", group: "New" },
  { id: "new-person", name: "New person", label: "Person", icon: "user-plus", kind: "create", template: "Person", group: "New" },
  { id: "new-runbook", name: "New runbook", label: "Runbook", icon: "book-open-check", kind: "create", template: "Runbook", group: "New" },
  { id: "new-write-up", name: "New write-up", label: "Write-up", icon: "notebook-pen", kind: "create", template: "Write-up", group: "New" },
  { id: "new-project", name: "New project", label: "Project", icon: "folder-plus", kind: "create", template: "New Project", group: "New" },
  { id: "new-operations", name: "New operations area", label: "Operations area", icon: "cog", kind: "create", template: "New Operations", group: "New" },
  { id: "new-category", name: "New category", label: "Category", icon: "folder-tree", kind: "create", template: "Category Hub", group: "New" },
  { id: "weekly-review", name: "Weekly review", label: "Weekly review", icon: "calendar-range", kind: "create", template: "Weekly Report", group: "New" },

  { id: "open-home", name: "Open Home", label: "Home", icon: "home", kind: "open", path: "00 Home.md", group: "Go to" },
  { id: "open-today", name: "Open today's daily note", label: "Today", icon: "calendar-days", kind: "command", command: "daily-notes", group: "Go to" },
  { id: "open-git-activity", name: "Open Git Activity", label: "Git Activity", icon: "git-branch", kind: "open", path: "Git Activity.md", group: "Go to" },
  { id: "open-knowledge-base", name: "Open Knowledge Base", label: "Knowledge Base", icon: "library", kind: "open", path: "Knowledge Base/Knowledge Base.md", group: "Go to" },
  { id: "open-docs-links", name: "Open General Docs & Links", label: "Docs & Links", icon: "link", kind: "open", path: "General Docs & Links.md", group: "Go to" },
  { id: "open-help", name: "Open Commands and hotkeys help", label: "Help", icon: "help-circle", kind: "open", path: "Knowledge Base/Write-ups/Commands and hotkeys.md", group: "Go to" },

  { id: "refresh-git", name: "Refresh Git", label: "Refresh Git", icon: "refresh-cw", kind: "run", template: "Refresh Git", group: "Maintenance" },
  { id: "upgrade-vault", name: "Upgrade vault", label: "Upgrade vault", icon: "wrench", kind: "run", template: "Upgrade Vault", group: "Maintenance" },
  { id: "forget-git-tokens", name: "Forget saved Git tokens", label: "Forget Git tokens", icon: "key-round", kind: "run", template: "Git Forget Tokens", group: "Maintenance" },
];
const BY_ID = new Map(ACTIONS.map(a => [a.id, a]));
const FRICTION_LOG = "Knowledge Base/Write-ups/Friction log.md";

/** "quick-capture, new-meeting\nnew-issue" → [{id, action|null}] (unknown ids kept so they can be flagged). */
function parseActions(source) {
  return String(source || "").split(/[\s,|]+/).map(s => s.trim()).filter(Boolean).map(id => ({ id, action: BY_ID.get(id) || null }));
}

class TextPrompt extends Modal {
  constructor(app, title, placeholder, onSubmit) { super(app); this.title = title; this.placeholder = placeholder; this.onSubmit = onSubmit; }
  onOpen() {
    this.titleEl.setText(this.title);
    let value = "";
    const submit = () => { const v = value.trim(); if (v) { this.close(); this.onSubmit(v); } };
    new Setting(this.contentEl).addText(t => {
      t.setPlaceholder(this.placeholder).onChange(v => (value = v));
      t.inputEl.style.width = "100%";
      t.inputEl.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); submit(); } });
      setTimeout(() => t.inputEl.focus(), 0);
    });
    new Setting(this.contentEl).addButton(b => b.setButtonText("Save").setCta().onClick(submit));
  }
  onClose() { this.contentEl.empty(); }
}

class ProjectNotesPlugin extends Plugin {
  async onload() {
    for (const a of ACTIONS) this.addCommand({ id: a.id, name: a.name, icon: a.icon, callback: () => this.run(a.id) });
    this.addCommand({ id: "actions-menu", name: "Show all actions", icon: "layout-list", callback: () => this.showMenu() });
    this.addRibbonIcon("layout-list", "Project Notes: all actions", evt => this.showMenu(evt));
    this.registerMarkdownCodeBlockProcessor("actions", (source, el, ctx) => this.renderButtons(source, el, ctx));
  }

  // ---------- UI ----------
  showMenu(evt) {
    const menu = new Menu();
    let group = null;
    for (const a of ACTIONS) {
      if (a.group !== group) { if (group !== null) menu.addSeparator(); group = a.group; }
      menu.addItem(i => i.setTitle(a.name).setIcon(a.icon).onClick(() => this.run(a.id)));
    }
    if (evt) menu.showAtMouseEvent(evt); else menu.showAtPosition({ x: 120, y: 120 });
  }

  renderButtons(source, el, ctx) {
    const bar = el.createDiv({ cls: "pn-actions" });
    for (const { id, action } of parseActions(source)) {
      if (!action) { bar.createSpan({ cls: "pn-actions-unknown", text: `unknown action "${id}"` }); continue; }
      const btn = bar.createEl("button", { cls: "pn-action", attr: { "aria-label": action.name, "data-action": id } });
      setIcon(btn.createSpan({ cls: "pn-action-icon" }), action.icon);
      btn.createSpan({ text: action.label });
      btn.addEventListener("click", e => { e.preventDefault(); this.run(id, { sourcePath: ctx && ctx.sourcePath }); });
    }
  }

  // ---------- running actions ----------
  async run(id, { sourcePath } = {}) {
    const a = BY_ID.get(id);
    if (!a) return new Notice(`Project Notes: unknown action "${id}"`);
    try {
      if (a.kind === "open") return await this.openPath(a.path);
      if (a.kind === "command") {
        const ok = this.app.commands.executeCommandById(a.command);
        if (!ok) new Notice(id === "edit-task"
          ? "Put the cursor on a task in Editing view first (or use the ✏️ pencil next to a task in a task list)."
          : `Couldn't run "${a.command}". Is that plugin turned on?`);
        return;
      }
      if (a.kind === "fn" && id === "log-friction") return this.logFriction();
      const templater = this.templater();
      if (!templater) return new Notice("Project Notes needs the Templater plugin. Turn it on in Settings → Community plugins.", 10000);
      const template = this.templateFile(templater, a.template);
      if (!template) return new Notice(`Template "${a.template}" not found in the templates folder.`, 10000);
      if (a.kind === "create") return await templater.templater.create_new_note_from_template(template, undefined, undefined, true);
      return await this.runOnNote(templater, template, sourcePath);
    } catch (e) {
      console.error("Project Notes", e);
      new Notice(`Project Notes: ${e && e.message ? e.message : e}`, 10000);
    }
  }

  templater() {
    const p = this.app.plugins && this.app.plugins.plugins && this.app.plugins.plugins["templater-obsidian"];
    return p && p.templater ? p : null;
  }

  templateFile(templater, name) {
    const folder = normalizePath((templater.settings && templater.settings.templates_folder) || "_Templates");
    const f = this.app.vault.getAbstractFileByPath(`${folder}/${name}.md`);
    return f instanceof TFile ? f : null;
  }

  // Runs a template "on" the current note (Templater's Insert). Templater's own insert needs an editor, which
  // isn't there in Reading view, so fall back to running the template directly and appending any output.
  async runOnNote(templater, template, sourcePath) {
    const t = templater.templater;
    const ed = this.app.workspace.activeEditor;
    const viaEditor = ed && ed.editor && ed.file && (!sourcePath || ed.file.path === sourcePath)
      && this.app.workspace.getActiveViewOfType(MarkdownView)?.getMode?.() === "source";
    if (viaEditor) return t.append_template_to_active_file(template);
    const target = (sourcePath && this.app.vault.getAbstractFileByPath(sourcePath)) || this.app.workspace.getActiveFile()
      || this.app.vault.getAbstractFileByPath("00 Home.md");
    if (!(target instanceof TFile)) return new Notice("Open a note first.");
    const config = t.create_running_config(template, target, 1 /* RunMode.AppendActiveFile */);
    const out = await t.read_and_parse_template(config);
    if (out && out.trim()) await this.app.vault.process(target, d => d.replace(/\n*$/, "\n\n") + out.trim() + "\n");
  }

  async openPath(path) {
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof TFile)) return new Notice(`"${path}" doesn't exist in this vault.`);
    await this.app.workspace.getLeaf(false).openFile(f);
  }

  logFriction() {
    new TextPrompt(this.app, "What got in your way?", "e.g. had to switch to edit mode to cancel a task", async text => {
      let f = this.app.vault.getAbstractFileByPath(FRICTION_LOG);
      if (!(f instanceof TFile)) {
        await this.app.vault.createFolder("Knowledge Base/Write-ups").catch(() => {});
        f = await this.app.vault.create(FRICTION_LOG, "# Friction log\n\n## Log\n");
      }
      const day = window.moment().format("YYYY-MM-DD");
      await this.app.vault.process(f, d => {
        const line = `- [ ] ${day} — ${text.replace(/\n/g, " ")}`;
        const i = d.indexOf("\n## Log");
        if (i < 0) return d.replace(/\n*$/, "\n\n## Log\n") + line + "\n";
        const next = d.indexOf("\n## ", i + 7);
        const end = next < 0 ? d.length : next;
        return d.slice(0, end).replace(/\n*$/, "\n") + line + "\n" + d.slice(end);
      });
      new Notice("Logged to Friction log");
    }).open();
  }
}

module.exports = ProjectNotesPlugin;
module.exports.ACTIONS = ACTIONS;
module.exports.parseActions = parseActions;
