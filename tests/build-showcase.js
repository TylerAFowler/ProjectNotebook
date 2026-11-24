// Rebuilds examples/Showcase Vault and examples/ObsidianNotesDemo.bundle from ../vault.
//   npm run showcase
const fs = require("fs"), os = require("os"), path = require("path"), { execFileSync } = require("child_process");
const ROOT = path.resolve(__dirname, ".."), EX = path.join(ROOT, "examples"), OUT = path.join(EX, "Showcase Vault");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "showcase-"));
execFileSync("python3", [path.join(ROOT, "tools/make-demo-code.py"), tmp], { stdio: "inherit" });
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, "vault"), OUT, { recursive: true, filter: s => path.basename(s) !== ".gitkeep" });
execFileSync(process.execPath, [path.join(__dirname, "showcase.js"), OUT, path.join(tmp, "ObsidianNotesDemo")], { stdio: ["ignore", "ignore", "inherit"] });
fs.copyFileSync(path.join(EX, "Start here (showcase tour).md"), path.join(OUT, "▶ Start here.md"));
fs.copyFileSync(path.join(tmp, "ObsidianNotesDemo.bundle"), path.join(EX, "ObsidianNotesDemo.bundle"));
fs.rmSync(tmp, { recursive: true, force: true });
console.log("Built", OUT);
