const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

function updateFlutterWorkspace(workspace, branch) async {
  await exec.exec(`git checkout -b ${branch}`);
  await exec.exec(`cd ${workspace}`);
  await exec.exec('flutter pub upgrade');
  await exec.exec('git add -A && git commit -m && git push');
}

function openPullRequest(base, head, octokit) async {
  await octokit.pulls.create({
    owner,
    repo,
    title,
    head,
    base
  });
}

function main() async {
  try {
    const flutterProjectWorkspace = core.getInput('flutter-project');
    console.log(`Analyzing Flutter project @ ${flutterProjectWorkspace}...`);
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

await main();
