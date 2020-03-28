const core = require("@actions/core");
const initContext = require("./lib/init");
const maybeOpenPullRequest = require("./lib/pull");
const updateFlutterWorkspace = require("./lib/upgrade");

async function main() {
  try {
    const context = initContext();
    await updateFlutterWorkspace(context);
    if(context.needPr)
      await maybeOpenPullRequest(context);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
