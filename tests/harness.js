// Minimal mock of Obsidian + Templater, enough to run the vault's templates for real.
// The clock is frozen (FAKE_NOW, default Tue 24 Nov 2026 4 PM Eastern) so results are reproducible.
process.env.TZ = process.env.TZ || "America/New_York";
{
  const FIXED = Date.parse(process.env.FAKE_NOW || "2026-11-24T16:00:00-05:00"), RealDate = Date;
  global.Date = class extends RealDate { constructor(...a) { if (a.length) super(...a); else super(FIXED); } static now() { return FIXED; } };
}
const fs = require("fs"), path = require("path"), yaml = require("js-yaml"), moment = require("moment");
global.window = { moment };
const ROOT = process.argv[2];
if (!ROOT) { console.error("usage: node <test>.js <copy-of-vault-folder>"); process.exit(2); }
const abs = p => path.join(ROOT, p);
function build() {
  const map = new Map();
  const mk = (rel, parent) => {
    const st = fs.statSync(abs(rel || "."));
    if (st.isDirectory()) {
      const f = { path: rel || "/", name: rel ? path.basename(rel) : "", parent, children: [] };
      map.set(f.path, f);
      for (const c of fs.readdirSync(abs(rel || "."))) if (!c.startsWith(".")) f.children.push(mk(rel ? `${rel}/${c}` : c, f));
      return f;
    }
    const f = { path: rel, name: path.basename(rel), basename: path.basename(rel).replace(/\.md$/, ""), extension: path.extname(rel).slice(1), parent, stat: { mtime: st.mtimeMs } };
    map.set(rel, f); return f;
  };
  const root = mk("", null); return { root, map };
}
const vault = {
  getRoot: () => build().root,
  getMarkdownFiles: () => [...build().map.values()].filter(f => f.extension === "md"),
  getAbstractFileByPath: p => build().map.get(p) ?? null,
  createFolder: async p => { if (fs.existsSync(abs(p))) throw new Error("Folder already exists " + p); fs.mkdirSync(abs(p)); },
  create: async (p, c) => { if (fs.existsSync(abs(p))) throw new Error("File already exists " + p); fs.writeFileSync(abs(p), c); global.__current = p; /* real Templater's on-create trigger hijacks "current file" */ return vault.getAbstractFileByPath(p); },
  read: async f => fs.readFileSync(abs(f.path), "utf8"),
  cachedRead: async f => fs.readFileSync(abs(f.path), "utf8"),
  process: async (f, fn) => { const d = fs.readFileSync(abs(f.path), "utf8"); fs.writeFileSync(abs(f.path), fn(d)); },
};
const metadataCache = { getFileCache: f => {
  const t = fs.readFileSync(abs(f.path), "utf8"); const m = t.match(/^---\n([\s\S]*?)\n---/);
  return { frontmatter: m ? yaml.load(m[1]) : undefined };
}};
const fileManager = {
  processFrontMatter: async (f, fn) => {
    const t = fs.readFileSync(abs(f.path), "utf8"); const mm = t.match(/^---\n([\s\S]*?)\n---\n?/);
    const data = mm ? (yaml.load(mm[1], { schema: yaml.CORE_SCHEMA }) || {}) : {};
    fn(data);
    const y = yaml.dump(data, { schema: yaml.CORE_SCHEMA, lineWidth: -1 });
    fs.writeFileSync(abs(f.path), `---\n${y}---\n` + (mm ? t.slice(mm[0].length) : t));
  },
  renameFile: async (f, np) => { const from = f.path; fs.renameSync(abs(from), abs(np)); if (f.__self) f.__self(np); } };
const ls = new Map();
const app = { vault, metadataCache, fileManager, loadLocalStorage: k => ls.has(k) ? ls.get(k) : null, saveLocalStorage: (k, v) => v === null ? ls.delete(k) : ls.set(k, v), __ls: ls };

async function run(templateName, answers, { target = "Untitled.md", active = null } = {}) {
  const tpl = fs.readFileSync(abs(`_Templates/${templateName}.md`), "utf8");
  if (!fs.existsSync(abs(target))) fs.writeFileSync(abs(target), "");
  let targetPath = target;
  global.__current = null;
  const self = { get path() { return targetPath; }, __self: np => { targetPath = np; } };
  const q = [...answers];
  const next = (kind, ...a) => { if (!q.length) throw new Error(`No scripted answer for ${kind}: ${a[0]}`); const x = q.shift(); return typeof x === "function" ? x(...a) : x; };
  const tp = {
    app, obsidian: { Notice: class { constructor(m) { console.log("  [Notice]", m); } }, requestUrl: async o => global.__fetch(o) },
    system: { suggester: async (labels, values, _t, ph) => next("suggester", ph, labels, values),
              prompt: async (ph, def) => next("prompt", ph, def) },
    date: { now: fmt => moment().format(fmt) },
    file: { get title() { return path.basename(targetPath, ".md"); },
            move: async np => { const dst = np + ".md"; const src = global.__current ?? targetPath; fs.renameSync(abs(src), abs(dst)); if (src === targetPath) targetPath = dst; } },
    config: { active_file: active ? vault.getAbstractFileByPath(active) : null, target_file: self, template_file: { basename: templateName } },
    user: {},
  };
  for (const s of fs.readdirSync(abs("_Scripts"))) { const fn = require(abs(`_Scripts/${s}`)); tp.user[path.basename(s, ".js")] = (...a) => fn(...a); }
  // Compile like Templater: text → tR +=, <%* %> → code, <% %> → tR += expr
  let src = "let tR = '';\n", last = 0;
  tpl.replace(/<%(\*|)([\s\S]*?)(-?)%>(\n?)/g, (m, star, code, trim, nl, idx) => {
    src += `tR += ${JSON.stringify(tpl.slice(last, idx))};\n`;
    src += star ? code + "\n" : `tR += (${code});\n`;
    if (!trim) src += `tR += ${JSON.stringify(nl)};\n`;
    last = idx + m.length; return m;
  });
  src += `tR += ${JSON.stringify(tpl.slice(last))};\nreturn tR;`;
  const AsyncFn = Object.getPrototypeOf(async () => {}).constructor;
  const out = await new AsyncFn("tp", "app", src)(tp, app);
  fs.writeFileSync(abs(targetPath), (fs.readFileSync(abs(targetPath), "utf8")) + out);
  if (out.includes("[!error]")) throw new Error(`${templateName}: template reported an error:\n${out}`);
  if (q.length) throw new Error(`${templateName}: ${q.length} unused answers`);
  console.log(`✔ ${templateName} → ${targetPath}`);
  return targetPath;
}
module.exports = { run, app };
