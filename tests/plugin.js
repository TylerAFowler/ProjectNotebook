// Tests the Project Notes plugin (vault/.obsidian/plugins/project-notes) against a small mock of the Obsidian API.
const Module = require("module"), fs = require("fs"), path = require("path");
const VAULT = path.resolve(__dirname, "../vault");
class TFile { constructor(p) { this.path = p; this.basename = path.basename(p, ".md"); } }
const notices = [];
const fakeEl = () => {
  const el = { children: [], listeners: {}, text: "", attr: {} };
  const child = (tag, o = {}) => { const c = fakeEl(); c.tag = tag; c.cls = o.cls; c.text = o.text || ""; c.attr = o.attr || {}; el.children.push(c); return c; };
  Object.assign(el, { createDiv: o => child("div", o), createEl: (t, o) => child(t, o), createSpan: o => child("span", o),
    addEventListener: (ev, fn) => (el.listeners[ev] = fn) });
  return el;
};
const obsidianMock = {
  Plugin: class { constructor(app) { this.app = app; this.commands = []; this.ribbon = []; this.processors = {}; }
    addCommand(c) { this.commands.push(c); } addRibbonIcon(i, t, cb) { this.ribbon.push({ i, t, cb }); }
    registerMarkdownCodeBlockProcessor(lang, fn) { this.processors[lang] = fn; } },
  Notice: class { constructor(m) { notices.push(m); } },
  Menu: class { addItem() { return this; } addSeparator() {} showAtMouseEvent() {} showAtPosition() {} },
  Modal: class {}, Setting: class {}, TFile, MarkdownView: class {},
  setIcon: (el, icon) => { el.icon = icon; }, normalizePath: p => p.replace(/\/+$/, ""),
};
const origLoad = Module._load;
Module._load = function (req, ...a) { return req === "obsidian" ? obsidianMock : origLoad.call(this, req, ...a); };
global.window = { moment: require("moment") };

const PluginClass = require(path.join(VAULT, ".obsidian/plugins/project-notes/main.js"));
const { ACTIONS, parseActions } = PluginClass;
const files = new Map();
const appended = {};
const calls = [];
const exists = p => fs.existsSync(path.join(VAULT, p));
const app = {
  vault: { getAbstractFileByPath: p => (exists(p) ? new TFile(p) : null),
           process: async (f, fn) => { appended[f.path] = fn(""); } },
  workspace: { activeEditor: null, getActiveFile: () => new TFile("00 Home.md"), getActiveViewOfType: () => null,
               getLeaf: () => ({ openFile: async f => calls.push(["open", f.path]) }) },
  commands: { executeCommandById: id => { calls.push(["command", id]); return true; } },
  plugins: { plugins: { "templater-obsidian": { settings: { templates_folder: "_Templates" }, templater: {
    create_new_note_from_template: async (f, folder, name, open) => calls.push(["create", f.path, open]),
    append_template_to_active_file: async f => calls.push(["append", f.path]),
    create_running_config: (tpl, target, mode) => ({ tpl, target, mode }),
    read_and_parse_template: async cfg => { calls.push(["run", cfg.tpl.path, cfg.target.path, cfg.mode]); return cfg.tpl.path.includes("Refresh") ? "> [!error] boom" : ""; },
  } } } },
};
const fail = m => { console.error("FAIL", m); process.exit(1); };
(async () => {
  const p = new PluginClass(app, {}); await p.onload();
  if (p.commands.length !== ACTIONS.length + 1) fail("command count");
  if (!p.ribbon.length || !p.processors.actions) fail("ribbon / actions block not registered");
  const ids = new Set(p.commands.map(c => c.id));
  for (const a of ACTIONS) {
    if (a.template && !exists(`_Templates/${a.template}.md`)) fail(`${a.id}: template ${a.template} missing`);
    if (a.path && !exists(a.path)) fail(`${a.id}: ${a.path} missing`);
  }
  // create / run (Reading view → no editor → direct run, output appended) / open / command
  await p.run("new-meeting"); await p.run("quick-capture", { sourcePath: "00 Home.md" });
  await p.run("refresh-git", { sourcePath: "Git Activity.md" }); await p.run("open-help"); await p.run("open-today");
  const want = [["create", "_Templates/Meeting.md", true], ["run", "_Templates/Quick Capture.md", "00 Home.md", 1],
    ["run", "_Templates/Refresh Git.md", "Git Activity.md", 1], ["open", "Knowledge Base/Write-ups/Commands and hotkeys.md"], ["command", "daily-notes"]];
  if (JSON.stringify(calls) !== JSON.stringify(want)) fail("calls:\n" + JSON.stringify(calls, null, 1));
  if (!String(appended["Git Activity.md"]).includes("[!error] boom")) fail("template output (error box) should be appended to the note");
  // editing view → Templater's own insert
  app.workspace.activeEditor = { editor: {}, file: new TFile("00 Home.md") };
  app.workspace.getActiveViewOfType = () => ({ getMode: () => "source" });
  calls.length = 0; await p.run("quick-capture", { sourcePath: "00 Home.md" });
  if (calls[0]?.[0] !== "append") fail("editing view should use Templater's insert: " + JSON.stringify(calls));
  // buttons
  const el = fakeEl(); p.processors.actions("quick-capture, new-issue\nbogus", el, { sourcePath: "00 Home.md" });
  const bar = el.children[0];
  if (bar.children.length !== 3 || bar.children[2].tag !== "span" || !bar.children[2].text.includes("bogus")) fail("button rendering");
  calls.length = 0; await bar.children[1].listeners.click({ preventDefault() {} }); await new Promise(r => setTimeout(r, 0));
  if (calls[0]?.[1] !== "_Templates/Issue.md") fail("button click should create an issue: " + JSON.stringify(calls));
  // every ```actions block shipped anywhere uses known ids; preset hotkeys point at real commands
  const scan = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => d.name.startsWith(".") || d.name === "node_modules" ? [] :
    d.isDirectory() ? scan(path.join(dir, d.name)) : d.name.endsWith(".md") || d.name.endsWith(".js") ? [path.join(dir, d.name)] : []);
  const known = new Set(ACTIONS.map(a => a.id));
  for (const f of [...scan(VAULT), ...scan(path.resolve(__dirname, "../examples"))]) {
    const rel = path.relative(path.resolve(__dirname, ".."), f), text = fs.readFileSync(f, "utf8");
    const code = /[\\/](_Templates|_Scripts)[\\/]/.test(f);
    const lists = code
      ? [...text.matchAll(/(?:"|\n)((?:[a-z]+(?:-[a-z]+)+ ?)+)(?:"|\\n)/g)].map(m => m[1]).filter(l => l.split(" ").some(x => known.has(x)))
      : [...text.matchAll(/```actions\n([\s\S]*?)```/g)].map(m => m[1]);
    for (const l of lists) { const bad = parseActions(l).filter(x => !x.action); if (bad.length) fail(`${rel}: unknown action(s) ${bad.map(b => b.id)}`); }
  }
  const preset = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../tools/recommended-hotkeys.json"), "utf8"));
  for (const id of Object.keys(preset)) if (!ids.has(id.replace("project-notes:", ""))) fail(`preset hotkey for unknown command ${id}`);
  const combos = Object.values(preset).map(v => v[0].modifiers.join("+") + "+" + v[0].key);
  if (new Set(combos).size !== combos.length) fail("duplicate preset hotkeys");
  for (const j of ["types.json", "community-plugins.json", "plugins/obsidian-tasks-plugin/data.json", "plugins/homepage/data.json", "plugins/templater-obsidian/data.json"])
    JSON.parse(fs.readFileSync(path.join(VAULT, ".obsidian", j), "utf8"));
  console.log(`✔ plugin: ${p.commands.length} commands, buttons, Reading/Editing view paths, ${Object.keys(preset).length} preset hotkeys`);
  console.log("PLUGIN OK");
})().catch(e => fail(e.stack));
