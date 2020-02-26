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
  await exec.exec('git', ['config', '--global', 'user.email', 'tianhaoz@umich.edu']);
  await exec.exec('git', ['config', '--global', 'user.name', 'Tianhao Zhou']);
  await exec.exec('git add -A');
  await exec.exec('git commit -m \"chore(flutterbot): update flutter packages\"');
  await exec.exec('git', ['push', '-f' , `https://github.com/${process.env.GITHUB_REPOSITORY}.git`, branch], {
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

async function shouldOpenPullRequest(base, head, octokit) {
  const pullRequestList = await octokit.pulls.list({
    owner: 'tianhaoz95',
    repo: 'update-flutter-packages',
  });
  for (const pullRequest of pullRequestList.data) {
    if (pullRequest.title === 'test pull request' && pullRequest.state === 'open') {
      return false;
    }
  }
  return true;
}

async function openPullRequest(base, head, octokit) {
  await octokit.pulls.create({
    owner: 'tianhaoz95',
    repo: 'update-flutter-packages',
    title: 'test pull request',
    head,
    base,
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
    const octokit = new github.GitHub(octoToken);
    const openPullRequest = await shouldOpenPullRequest('master', 'test', octokit);
    if (openPullRequest) {
      console.log('not opened, open pull request');
      await openPullRequest('master', 'test', octokit);
    } else {
      console.log('pull request already there, skip');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
