// Templater user script: tp.user.kbParts(tp, { what }) → shared prompts + sections for Knowledge Base notes
// (runbooks and write-ups): topic, related projects/categories, and the documents/links tables.
async function kbParts(tp, { what }) {
  const topic = (await tp.system.prompt(`Topic for this ${what} (e.g. SAML / Identity, OCI, Oracle; groups the index)`, ""))?.trim() || "";
  const rel = (await tp.system.prompt("Related projects/categories, comma-separated (optional; e.g. WVDOT.saml2, OCI). It will show on their hubs.", "")) || "";
  const related = rel.split(",").map(s => s.trim().replace(/^\[\[|\]\]$/g, "")).filter(Boolean);
  const yaml = `topic: ${topic ? JSON.stringify(topic) : ""}\nrelated:${related.length ? "\n" + related.map(r => `  - "[[${r}]]"`).join("\n") : " []"}`;
  const refs = `## 📄 Relevant documents
*Quick Capture → Document → "📘 This note". Location = file path, share/SharePoint path, or URL.*

| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
|          |                              |          |

## 🌐 Useful links
*Quick Capture → Link → "📘 This note".*

| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
|      |                              |     |`;
  return { topic, related, yaml, refs };
}
module.exports = kbParts;
