import util from "node:util";
import { exec } from "node:child_process";
import readline from "node:readline";

const COLOR = {
  Reset: "\x1b[0m",
  FgGreen: "\x1b[32m",
};

const checkoutSys = async (option: string) => {
  const branches = await getBranches(option === "-a");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(
    branches
      .map(
        (branch, index) =>
          `${branch.startsWith("*") ? COLOR.FgGreen : ""} ${
            index + 1
          }. ${branch}${COLOR.Reset}`
      )
      .join("\n")
  );
  rl.question("---\nBranch? ", (answer) => {
    const branchIndex = Number(answer);
    if (
      isNaN(branchIndex) ||
      branchIndex < 0 ||
      branchIndex > branches.length
    ) {
      console.log("Wrong Input.");
    } else {
      const target = branches[branchIndex - 1].replace("* ", "");
      switchBranch(target);
    }
    rl.close();
  });
};

const getBranches = async (includeRemote: boolean) => {
  const cmd = `git branch ${includeRemote ? "-a" : ""}`;

  try {
    const { stdout } = await runExec(cmd);
    return stdout
      .trim()
      .split("\n")
      .map((line) => line.trimEnd());
  } catch (e) {
    console.error(e);
    return [];
  }
};

const switchBranch = async (branch: string) => {
  const cmd = `git checkout ${branch}`;
  const { stdout, stderr } = await runExec(cmd);
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
};

const runExec = async (cmd: string) => {
  const execPromise = util.promisify(exec);
  return execPromise(cmd);
};

export default checkoutSys;
