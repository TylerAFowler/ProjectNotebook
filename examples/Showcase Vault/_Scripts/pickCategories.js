// Templater user script: tp.user.pickCategories(tp, "what")
// Asks for the MAIN category (the folder it will live in), then lets you add any number of
// extra categories it also belongs to (e.g. Dashcam projects that are also part of OCI).
// Returns an array of category names; the first is the main one. New names are allowed.
async function pickCategories(tp, what = "project") {
  const SKIP = ["_Templates", "_Scripts", "Daily", "People", "Weekly", "Knowledge Base"];
  const existing = tp.app.vault.getRoot().children
    .filter(f => f.children !== undefined && !SKIP.includes(f.name) && !f.name.startsWith("."))
    .map(f => f.name).sort();

  const ask = async (title, exclude, doneLabel) => {
    const opts = existing.filter(c => !exclude.includes(c));
    const labels = [...(doneLabel ? [doneLabel] : []), ...opts, "➕ New category…"];
    const values = [...(doneLabel ? ["__done__"] : []), ...opts, "__new__"];
    let c = await tp.system.suggester(labels, values, false, title);
    if (!c) return doneLabel ? "__done__" : null;
    if (c === "__new__") {
      c = (await tp.system.prompt("New category name (e.g. Crash Database, OCI)"))?.trim();
      if (!c) return doneLabel ? "__done__" : null;
    }
    return c;
  };

  const main = await ask(`Main category for this ${what} (the folder it lives in)`, [], null);
  if (!main) throw new Error("Cancelled. Delete the empty Untitled note.");
  const all = [main];
  for (;;) {
    const c = await ask(`Also part of another category? (so far: ${all.join(", ")})`, all, "✔ No, that's all");
    if (c === "__done__") break;
    if (!all.includes(c)) all.push(c);
  }
  return all;
}
module.exports = pickCategories;
