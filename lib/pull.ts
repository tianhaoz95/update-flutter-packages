import { ApplicationContext } from "./model/applicationContext.ts";

async function shouldOpenPullRequest(context: ApplicationContext) {
  const pullRequestList = await context.octokit.pulls.list({
    owner: context.username,
    repo: context.project
  });
  for (const pullRequest of pullRequestList.data) {
    if (
      pullRequest.title === context.pullRequestTitle &&
      pullRequest.state === "open"
    ) {
      return false;
    }
  }
  return true;
}

async function openUpdatePullRequest(context: ApplicationContext) {
  await context.octokit.pulls.create({
    owner: context.username,
    repo: context.project,
    title: context.pullRequestTitle,
    head: context.tempBranch,
    base: context.targetBranch
  });
}

async function maybeOpenPullRequest(context: ApplicationContext) {
  const openPullRequest = await shouldOpenPullRequest(context);
  if (openPullRequest) {
    console.log("not opened, open pull request");
    await openUpdatePullRequest(context);
  } else {
    console.log("pull request already there, skip");
  }
}

export { maybeOpenPullRequest } 
