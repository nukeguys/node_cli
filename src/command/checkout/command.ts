import { Command } from "commander";
import shell from "shelljs";
import chalk from "chalk";
import inquirer from "inquirer";

const checkout = new Command("checkout");

const isCurrentBranch = (branch: string) => branch[0] === "*";

checkout
  .description("switch git branch")
  .argument("[branch]", "branch name (regex)")
  .option("-a, --all", "include remote branch")
  .action(async (filter?: string) => {
    const options = checkout.opts();
    const cmd = `git branch ${options.all ? "-a" : ""} ${
      filter ? `| grep ${filter}` : ""
    }`;

    const result = shell.exec(cmd, { silent: true });
    if (result.code !== 0) {
      console.error(result.stderr);
      return;
    }

    const branches = result
      .trim()
      .split("\n")
      .map(line => line.trim());

    const { branch } = await inquirer.prompt([
      {
        type: "rawlist",
        name: "branch",
        prefix: ">",
        message: "which branch do you want to checkout?",
        pageSize: 10,
        choices: branches.map(single => ({
          name: isCurrentBranch(single) ? chalk.green(single) : single, // highlight current branch
          value: single,
        })),
        default: branches.find(isCurrentBranch),
        filter: answer => answer.replace("remotes/origin/", "").trim(),
      },
    ]);

    if (!isCurrentBranch(branch)) shell.exec(`git switch ${branch}`);
  });

export default checkout;
