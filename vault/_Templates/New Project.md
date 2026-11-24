<%*
try {
// Creates <Main category>/<Project>/<Project>.md (hub) + "<Project> - Tasks", optional FAQ, Meetings/ Issues/ Notes/.
// A project can belong to several categories; it lives in the first one's folder and shows on every category hub.
const self = tp.config.target_file;   // grab THIS note before anything else is created
const cats = await tp.user.pickCategories(tp, "project");
const name = (await tp.system.prompt("Project name"))?.trim();
if (!name) throw new Error("Cancelled. Delete the empty Untitled note.");
const faq = await tp.system.suggester(["No FAQ (you can add one later via Quick Capture)", "Yes, add a FAQ note"], [false, true], false, "Add a FAQ note for this project?");
await tp.user.setupHub(tp, { self, cats, name, kind: "project", faq });
const P = tp.user.hubParts({ name, cats, kind: "project", faq }), F = P.F;

tR += `${P.props}

> [!tip] 🧭 Where I left off
> *Update this every time you switch away.*
> - 

${P.waiting}

## 📋 Open tasks  ·  [[${name} - Tasks|full history]]
${F}tasks
not done
tags do not include #waiting
path includes {{query.file.folder}}
sort by status.type
sort by due
sort by priority
short mode
${F}

${P.requirements}

${P.git}

${P.related}

${P.reference}

${P.issues}

${P.meetings}

${P.notes}
`;
} catch (e) {
  // Show any failure in the note itself and in a 15-second notice.
  console.error("Template error", e);
  const msg = e?.message ?? String(e);
  new tp.obsidian.Notice(`Template error: ${msg}`, 15000);
  if (!msg.startsWith("Cancelled")) tR += `\n> [!error] Template "${tp.config.template_file?.basename ?? ""}" failed\n> **${msg}**\n> Copy this box (and the stack below) to report it.\n\n` + "```\n" + (e?.stack ?? "") + "\n```\n";
}
%>
