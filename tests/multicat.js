const { run } = require("./harness");
(async () => {
  await run("New Operations", ["__new__", "Dashcam", "__done__", "Dashcam Operations", false, false]);
  await run("New Project", ["Dashcam", "__new__", "OCI", "__done__", "Dashcam Backend", false]);
  await run("Category Hub", ["__new__", "Empty Cat"]);
})().catch(e => { console.error("FAIL", e); process.exit(1); });
