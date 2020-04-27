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
const exec_1 = require("@actions/exec");
function updateFlutterWorkspace(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let infoOutput = "";
        let errorOuput = "";
        yield exec_1.exec(`git checkout -b ${context.tempBranch}`);
        yield exec_1.exec("flutter", ["pub", "upgrade"], {
            cwd: context.flutterProjectWorkspace
        });
        yield exec_1.exec("git", [
            "config",
            "--global",
            "user.email",
            context.gitEmail
        ]);
        yield exec_1.exec("git", ["config", "--global", "user.name", context.gitName]);
        yield exec_1.exec("git add -A");
        try {
            context.needPr = (yield exec_1.exec('git diff-index --quiet HEAD')) !== 0;
        }
        catch (e) {
            context.needPr = true;
        }
        if (context.needPr) {
            yield exec_1.exec('git commit -m "chore(flutterbot): update flutter packages"');
            yield exec_1.exec("git", [
                "push",
                "-f",
                `https://${context.username}:${context.octoToken}@github.com/${context.repo}.git`,
                context.tempBranch
            ], {
                listeners: {
                    stdout: data => {
                        infoOutput += data.toString();
                    },
                    stderr: data => {
                        errorOuput += data.toString();
                    }
                }
            });
        }
        console.log(infoOutput);
        console.log(errorOuput);
    });
}
exports.updateFlutterWorkspace = updateFlutterWorkspace;
