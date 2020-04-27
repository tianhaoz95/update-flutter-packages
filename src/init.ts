import { getInput } from "@actions/core"
import { GitHub, context } from "@actions/github"
import { ApplicationContext } from "./model/applicationContext"

function initContext() {
  const flutterProjectWorkspace = getInput("flutter-project");
  console.log(`Analyzing Flutter project @ ${flutterProjectWorkspace}...`);

  const tempBranch = getInput("temp-branch");
  console.log(`Will update packages on ${tempBranch}...`);

  const targetBranch = getInput("target-branch");
  console.log(`Will send pull request to ${targetBranch}...`);

  const pullRequestTitle = getInput("title");
  console.log(`Will use pull request with title ${pullRequestTitle}...`);

  const repo = process.env.GITHUB_REPOSITORY!;
  console.log(`Will update ${repo}...`);

  const username = repo!.split("/")[0];
  console.log(`Will use username ${username}...`);

  const project = repo!.split("/")[1];
  console.log(`Will use project name ${project}...`);

  const gitEmail = getInput("git-email");
  console.log(`Will use ${gitEmail} for git...`);

  const gitName = getInput("git-name");
  console.log(`Will use ${gitName} for git...`);

  const logLevel = getInput("log");
  console.log(`Logging Level: ${logLevel}`);

  const octoToken = getInput("token");
  console.log(`GitHub authentication token: ${octoToken}`);

  const octoPayload = JSON.stringify(context.payload, undefined, 2);
  console.log(`The event payload: ${octoPayload}`);

  const octokit = new GitHub(octoToken);

  const appContext: ApplicationContext = {
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
    needPr: false
  };
  return appContext
}

export { initContext }
