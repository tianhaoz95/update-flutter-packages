const core = require('@actions/core');

function initContext() {
  const flutterProjectWorkspace = core.getInput('flutter-project');
  console.log(`Analyzing Flutter project @ ${flutterProjectWorkspace}...`);
  const tempBranch = core.getInput('temp-branch');
  console.log(`Will update packages on ${tempBranch}...`);
  const targetBranch = core.getInput('target-branch');
  console.log(`Will send pull request to ${targetBranch}...`);
  const pullRequestTitle = core.getInput('title');
  console.log(`Will use pull request with title ${pullRequestTitle}...`);
  const repo = process.env.GITHUB_REPOSITORY;
  console.log(`Will update ${repo}...`);
  const username = repo.split('/')[0];
  console.log(`Will use username ${username}...`);
  const project = repo.split('/')[1];
  console.log(`Will use project name ${project}...`);
  const gitEmail = core.getInput('git-email');
  console.log(`Will use ${gitEmail} for git...`);
  const gitName = core.getInput('git-name');
  console.log(`Will use ${gitName} for git...`);
  const logLevel = core.getInput('log');
  console.log(`Logging Level: ${logLevel}`);
  const octoToken = core.getInput('token');
  console.log(`GitHub authentication token: ${octoToken}`);
  const octoPayload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${octoPayload}`);
  const octokit = new github.GitHub(octoToken);
  return {
    flutterProjectWorkspace,
    gitEmail,
    gitName,
    logLevel,
    octokit,
    octoPayload,
    octoToken,
    project,
    pullRequestTitle,
    repo,
    targetBranch,
    tempBranch,
    username,
  };
}

module.exports = initContext;