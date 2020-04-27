"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function shouldOpenPullRequest(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const pullRequestList = yield context.octokit.pulls.list({
            owner: context.username,
            repo: context.project
        });
        for (const pullRequest of pullRequestList.data) {
            if (pullRequest.title === context.pullRequestTitle &&
                pullRequest.state === "open") {
                return false;
            }
        }
        return true;
    });
}
function openUpdatePullRequest(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield context.octokit.pulls.create({
            owner: context.username,
            repo: context.project,
            title: context.pullRequestTitle,
            head: context.tempBranch,
            base: context.targetBranch
        });
    });
}
function maybeOpenPullRequest(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const openPullRequest = yield shouldOpenPullRequest(context);
        if (openPullRequest) {
            console.log("not opened, open pull request");
            yield openUpdatePullRequest(context);
        }
        else {
            console.log("pull request already there, skip");
        }
    });
}
exports.maybeOpenPullRequest = maybeOpenPullRequest;
