// Templater user script: tp.user.faqNote("Project") → initial content for "<Project> - FAQ.md"
function faqNote(project) {
  return [
    "---", "type: faq", `project: "[[${project}]]"`, "---",
    `# ${project}: FAQ`, "",
    "> Answers to questions people ask about this project. Each question is collapsible: click to expand.",
    "> Add more with **Quick Capture → FAQ entry**, or copy the block below.", "",
    "## Questions", "",
    "> [!faq]- What is this project and who is it for?",
    "> ",
    "",
    "> [!faq]- Where does the data come from / where does it go?",
    "> ",
    "",
    "> [!faq]- Who do I contact about it?",
    "> ",
    "",
    "> [!faq]- When will it be done / what's the current status?",
    "> See **Where I left off** on the project hub.",
    ""
  ].join("\n");
}
module.exports = faqNote;
