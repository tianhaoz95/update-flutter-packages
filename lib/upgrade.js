const exec = require("@actions/exec");
const child_process = require('child_process');

async function updateFlutterWorkspace(context) {
  let infoOutput = "";
  let errorOuput = "";
  await exec.exec(`git checkout -b ${context.tempBranch}`);
  await exec.exec("flutter", ["pub", "upgrade"], {
    cwd: context.flutterProjectWorkspace
  });
  await exec.exec("git", [
    "config",
    "--global",
    "user.email",
    context.gitEmail
  ]);
  await exec.exec("git", ["config", "--global", "user.name", context.gitName]);
  await exec.exec("git add -A");
  child_process.execSync('git diff-index --quiet HEAD || git commit -m "chore(flutterbot): update flutter packages"', {stdio: 'inherit'});
  await exec.exec(
    "git",
    [
      "push",
      "-f",
      `https://${context.username}:${context.octoToken}@github.com/${context.repo}.git`,
      context.tempBranch
    ],
    {
      stdout: data => {
        infoOutput += data.toString();
      },
      stderr: data => {
        errorOuput += data.toString();
      }
    }
  );
  console.log(infoOutput);
  console.log(errorOuput);
}

module.exports = updateFlutterWorkspace;
