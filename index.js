const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

async function updateFlutterWorkspace(workspace, branch) {
  let infoOutput = '';
  let errorOuput = '';
  await exec.exec(`git checkout -b ${branch}`);
  await exec.exec('flutter', ['pub', 'upgrade'], {
    cwd: workspace
  });
  await exec.exec('git add -A');
  await exec.exec('git commit -m \"chore(flutterbot): update flutter packages\"');
  await exec.exec('git', ['push'], {
    env: {
      GITHUB_TOKEN: 'wtf'
    },
    stdout: (data) => {
      infoOutput += data.toString();
    },
    stderr: (data) => {
      errorOuput += data.toString();
    }
  });
  console.log(infoOutput);
  console.log(errorOuput);
}

async function openPullRequest(base, head, octokit) {
  await octokit.pulls.create({
    owner,
    repo,
    title,
    head,
    base
  });
}

async function main() {
  try {
    const flutterProjectWorkspace = core.getInput('flutter-project');
    console.log(`Analyzing Flutter project @ ${flutterProjectWorkspace}...`);
    const logLevel = core.getInput('log');
    console.log(`Logging Level: ${logLevel}`);
    const octoToken = core.getInput('token');
    console.log(`GitHub authentication token: ${octoToken}`);
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
    await updateFlutterWorkspace(flutterProjectWorkspace, 'test');
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
