const core = require("@actions/core");
const exec = require("@actions/exec");
const initContext = require("./lib/init");

async function updateFlutterWorkspace(context) {
  let infoOutput = "";
  let errorOuput = "";
  await exec.exec(`git checkout -b ${context.tempBranch}`);
  await exec.exec("flutter", ["pub", "upgrade"], {
    cwd: workspace
  });
  await exec.exec("git", [
    "config",
    "--global",
    "user.email",
    context.gitEmail
  ]);
  await exec.exec("git", ["config", "--global", "user.name", context.gitUser]);
  await exec.exec("git add -A");
  await exec.exec('git commit -m "chore(flutterbot): update flutter packages"');
  await exec.exec(
    "git",
    ["push", "-f", `https://github.com/${context.repo}.git`, branch],
    {
      stdout: data => {
        infoOutput += data.toString();
      },
      stderr: data => {
        errorOuput += data.toString();
      }
    }
  );
  console.log(infoOutput);
  console.log(errorOuput);
}

async function shouldOpenPullRequest(context) {
  const pullRequestList = await octokit.pulls.list({
    owner: context.username,
    repo: context.project
  });
  for (const pullRequest of pullRequestList.data) {
    if (
      pullRequest.title === context.pullRequestTitle &&
      pullRequest.state === 'open'
    ) {
      return false;
    }
  }
  return true;
}

async function openPullRequest(context) {
  await octokit.pulls.create({
    owner: context.username,
    repo: context.project,
    title: pullRequestTitle.pullRequestTitle,
    head: context.tempBranch,
    base: context.targetBranch
  });
}

async function maybeOpenPullRequest(context) {
  const openPullRequest = await shouldOpenPullRequest(context);
  if (openPullRequest) {
    console.log("not opened, open pull request");
    await openPullRequest(context);
  } else {
    console.log("pull request already there, skip");
  }
}

async function main() {
  try {
    const context = initContext();
    await updateFlutterWorkspace(context);
    await maybeOpenPullRequest(context);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
