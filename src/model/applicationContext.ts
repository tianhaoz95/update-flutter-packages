import { GitHub } from "@actions/github"

export interface ApplicationContext {
    flutterProjectWorkspace: string,
    gitEmail: string,
    gitName: string,
    logLevel: string,
    octokit: GitHub,
    octoPayload: string,
    octoToken: string,
    project: string,
    pullRequestTitle: string,
    repo: string,
    targetBranch: string,
    tempBranch: string,
    username: string,
    needPr: boolean
}