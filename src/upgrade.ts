import { exec } from "@actions/exec"
import { ApplicationContext } from "./model/applicationContext";
import { parseDocument } from "yaml"
import { readFileSync, writeFileSync } from "fs"
import { YAMLMap, Scalar, Pair } from "yaml/types";
import { asyncForEach } from "./utils/asyncForEach"
import { getLatestPackage } from "./utils/getLatestPackage";

async function updateFlutterWorkspace(context: ApplicationContext) {
  await exec(`git checkout -b ${context.tempBranch}`);
  // await exec("flutter", ["pub", "upgrade"], {
  //   cwd: context.flutterProjectWorkspace
  // });
  await updateYamlFile(context)
  await tryPushChanges(context)
}

async function updateYamlFile(context: ApplicationContext) {
  // let pubspecFilePath = `./labrat/pubspec.yaml`
  let pubspecFilePath = `${context.flutterProjectWorkspace}/pubspec.yaml`
  try {
    const pubspecFile = readFileSync(pubspecFilePath, 'utf8')
    let docYaml = parseDocument(pubspecFile)
    let dependencyMap: YAMLMap = docYaml.get('dependencies')
    if (!dependencyMap) { throw "No Dependecies Found" }

    let dependeciesList = dependencyMap.items
    if (dependeciesList.length == 0) { throw "No Dependecies Present" }
    await asyncForEach(dependeciesList, async (dependency) => {
      const dependencyKey: Scalar = dependency.key
      const dependencyValue: Scalar = dependency.value

      let dependencyName = dependencyKey.value
      let dependencyVersion = dependencyValue.value?.replace('^', '') ?? undefined

      if (!dependencyName) { return }
      if (!dependencyVersion) { return }

      if (['flutter'].includes(dependencyName)) {
        return
      }

      let latestVersion = await getLatestPackage(dependency)
      if (dependencyVersion != latestVersion) {
        dependencyMap.set(dependencyKey, latestVersion.version)
      }
      console.log(`
        Package Name => ${dependencyName}
        Current Version => ${dependencyVersion}
        Latest Version => ${latestVersion.version}`)
    })

    writeFileSync(pubspecFilePath, docYaml.toString())

  } catch (e) {
    console.log("There is a error")
    console.log(e)
  }
}

async function tryPushChanges(context: ApplicationContext) {
  let infoOutput = "";
  let errorOuput = "";
  await exec("git", [
    "config",
    "--global",
    "user.email",
    context.gitEmail
  ]);
  await exec("git", ["config", "--global", "user.name", context.gitName]);
  await exec("git add -A");
  try {
    context.needPr = (await exec('git diff-index --quiet HEAD')) !== 0;
  } catch (e) {
    context.needPr = true;
  }
  if (context.needPr) {
    await exec('git commit -m "chore(flutterbot): update flutter packages"');
    await exec(
      "git",
      [
        "push",
        "-f",
        `https://${context.username}:${context.octoToken}@github.com/${context.repo}.git`,
        context.tempBranch
      ],
      {
        listeners: {
          stdout: data => {
            infoOutput += data.toString();
          },
          stderr: data => {
            errorOuput += data.toString();
          }
        }
      }
    );
  }
  console.log(infoOutput);
  console.log(errorOuput);
}

export { updateFlutterWorkspace, updateYamlFile }
