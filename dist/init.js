"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
function initContext() {
    const flutterProjectWorkspace = core_1.getInput("flutter-project");
    console.log(`Analyzing Flutter project @ ${flutterProjectWorkspace}...`);
    const tempBranch = core_1.getInput("temp-branch");
    console.log(`Will update packages on ${tempBranch}...`);
    const targetBranch = core_1.getInput("target-branch");
    console.log(`Will send pull request to ${targetBranch}...`);
    const pullRequestTitle = core_1.getInput("title");
    console.log(`Will use pull request with title ${pullRequestTitle}...`);
    const repo = process.env.GITHUB_REPOSITORY;
    console.log(`Will update ${repo}...`);
    const username = repo.split("/")[0];
    console.log(`Will use username ${username}...`);
    const project = repo.split("/")[1];
    console.log(`Will use project name ${project}...`);
    const gitEmail = core_1.getInput("git-email");
    console.log(`Will use ${gitEmail} for git...`);
    const gitName = core_1.getInput("git-name");
    console.log(`Will use ${gitName} for git...`);
    const logLevel = core_1.getInput("log");
    console.log(`Logging Level: ${logLevel}`);
    const octoToken = core_1.getInput("token");
    console.log(`GitHub authentication token: ${octoToken}`);
    const octoPayload = JSON.stringify(github_1.context.payload, undefined, 2);
    console.log(`The event payload: ${octoPayload}`);
    const octokit = new github_1.GitHub(octoToken);
    const appContext = {
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
    return appContext;
}
exports.initContext = initContext;
