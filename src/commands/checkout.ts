import { execSync } from "node:child_process";
import Readline from "node:readline";

const COLOR = {
  Reset: "\x1b[0m",
  FgGreen: "\x1b[32m",
};

const getBranches = () => {
  const cmd = "git branch";
  try {
    const branches = execSync(cmd);
    return branches
      .toString()
      .trim()
      .split("\n")
      .map(branch => branch.trim());
  } catch (e) {
    return [];
  }
};

const checkout = () => {
  const branches = getBranches();

  branches.forEach((branch, index) => {
    console.log(
      `${branch.includes("*") ? COLOR.FgGreen : ""} ${index + 1}. ${branch}${
        COLOR.Reset
      }`
    );
  });

  const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("---\nBranch? ", answer => {
    const branchIndex = Number(answer);

    if (
      isNaN(branchIndex) ||
      branchIndex < 0 ||
      branchIndex > branches.length
    ) {
      console.error("wrong");
    } else {
      const targetBranch = branches[branchIndex - 1].replace("* ", "");

      try {
        execSync(`git checkout ${targetBranch}`);
      } catch {
        //
      }
    }

    rl.close();
  });
};

checkout();
