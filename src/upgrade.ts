import { exec } from "@actions/exec"
import { ApplicationContext } from "./model/applicationContext";

async function updateFlutterWorkspace(context: ApplicationContext) {
  let infoOutput = "";
  let errorOuput = "";
  await exec(`git checkout -b ${context.tempBranch}`);
  await exec("flutter", ["pub", "upgrade"], {
    cwd: context.flutterProjectWorkspace
  });
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

export { updateFlutterWorkspace }
