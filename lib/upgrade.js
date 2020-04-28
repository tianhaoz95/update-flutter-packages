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
const yaml_1 = require("yaml");
const fs_1 = require("fs");
const asyncForEach_1 = require("./utils/asyncForEach");
const getLatestPackage_1 = require("./utils/getLatestPackage");
function updateFlutterWorkspace(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec_1.exec(`git checkout -b ${context.tempBranch}`);
        // await exec("flutter", ["pub", "upgrade"], {
        //   cwd: context.flutterProjectWorkspace
        // });
        yield updateYamlFile(context);
        yield tryPushChanges(context);
    });
}
exports.updateFlutterWorkspace = updateFlutterWorkspace;
function updateYamlFile(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // let pubspecFilePath = `./labrat/pubspec.yaml`
        let pubspecFilePath = `${context.flutterProjectWorkspace}/pubspec.yaml`;
        try {
            const pubspecFile = fs_1.readFileSync(pubspecFilePath, 'utf8');
            let docYaml = yaml_1.parseDocument(pubspecFile);
            let dependencyMap = docYaml.get('dependencies');
            if (!dependencyMap) {
                throw "No Dependecies Found";
            }
            let dependeciesList = dependencyMap.items;
            if (dependeciesList.length == 0) {
                throw "No Dependecies Present";
            }
            yield asyncForEach_1.asyncForEach(dependeciesList, (dependency) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const dependencyKey = dependency.key;
                const dependencyValue = dependency.value;
                let dependencyName = dependencyKey.value;
                let dependencyVersion = (_b = (_a = dependencyValue.value) === null || _a === void 0 ? void 0 : _a.replace('^', '')) !== null && _b !== void 0 ? _b : undefined;
                if (!dependencyName) {
                    return;
                }
                if (!dependencyVersion) {
                    return;
                }
                if (['flutter'].includes(dependencyName)) {
                    return;
                }
                let latestVersion = yield getLatestPackage_1.getLatestPackage(dependency);
                if (!latestVersion) {
                    return;
                }
                if (dependencyVersion != latestVersion) {
                    dependencyMap.set(dependencyKey, latestVersion.version);
                }
                console.log(`
        Package Name => ${dependencyName}
        Current Version => ${dependencyVersion}
        Latest Version => ${latestVersion.version}`);
            }));
            fs_1.writeFileSync(pubspecFilePath, docYaml.toString());
        }
        catch (e) {
            console.log("There is a error");
            console.log(e);
        }
    });
}
exports.updateYamlFile = updateYamlFile;
function tryPushChanges(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let infoOutput = "";
        let errorOuput = "";
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
