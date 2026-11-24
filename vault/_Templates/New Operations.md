<%*
try {
// Creates an ongoing-work hub ("<Category> Operations") for an area of responsibility:
// recurring jobs, requests, runbooks, plus the usual reference sections. Never "done".
const self = tp.config.target_file;
const cats = await tp.user.pickCategories(tp, "operations hub");
const name = (await tp.system.prompt("Name", `${cats[0]} Operations`))?.trim();
if (!name) throw new Error("Cancelled. Delete the empty Untitled note.");
const deliverables = await tp.system.suggester(["No deliverables schedule (add later via Quick Capture → Deliverable)", "Yes, add a deliverables schedule"], [false, true], false, "Regular deliverables to other people?");
const faq = await tp.system.suggester(["No FAQ (you can add one later via Quick Capture)", "Yes, add a FAQ note"], [false, true], false, "Add a FAQ note?");
await tp.user.setupHub(tp, { self, cats, name, kind: "operations", faq });
const P = tp.user.hubParts({ name, cats, kind: "operations", faq }), F = P.F;

tR += `${P.props}

> [!info] Ongoing work for ${cats.map(c => `[[${c}]]`).join(", ")}: recurring jobs, requests and how-tos. Projects are listed on the category page.

## 🔁 Recurring jobs  ·  [[${name} - Tasks|full history]]
${F}tasks
not done
is recurring
path includes {{query.file.folder}}
sort by due
short mode
${F}

## 📬 Open requests
${F}tasks
not done
tags include #request
path includes {{query.file.folder}}
sort by due
short mode
${F}
**Recently delivered**
${F}tasks
tags include #request
(done this month) OR (done last month)
path includes {{query.file.folder}}
sort by done reverse
short mode
${F}

${P.waiting}

## 📋 Other open tasks
${F}tasks
not done
is not recurring
tags do not include #waiting
tags do not include #request
path includes {{query.file.folder}}
sort by due
sort by priority
short mode
${F}

${P.runbooks}

${P.git}

${P.related}
${deliverables ? "\n" + P.deliverablesTable + "\n" : ""}
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
