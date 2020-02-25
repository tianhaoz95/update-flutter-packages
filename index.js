const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

function updateFlutterWorkspace(workspace) async {
  await exec.exec('git checkout -b flutterbot/upgrade-packages');
  await exec.exec(`cd ${workspace}`);
  await exec.exec('flutter pub upgrade');
}

try {
  const flutterProjectWorkspace = core.getInput('flutter-project');
  console.log(`Analyzing Flutter project @ ${flutterProjectWorkspace}...`);
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
