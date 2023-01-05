import { Command } from "commander";
import shell from "shelljs";
import chalk from "chalk";
import inquirer from "inquirer";
import { getBranches } from "../../utils/git";

const checkout = new Command("checkout");

checkout
  .description("switch git branch")
  .argument("[branch]", "branch name (regex)")
  .option("-a, --all", "include remote branch")
  .action(async (filter?: string) => {
    const options = checkout.opts();

    const branches = getBranches({ all: options.all, filter });
    if (!branches) return;

    const { branch } = await inquirer.prompt([
      {
        type: "rawlist",
        name: "branch",
        prefix: ">",
        message: "which branch do you want to checkout?",
        pageSize: 10,
        choices: branches.list.map((branch) => ({
          name:
            branch === branches.current ? chalk.green(`* ${branch}`) : branch,
          value: branch,
        })),
        default: branches.current,
        filter: (answer) => answer.replace("remotes/origin/", "").trim(),
      },
    ]);

    if (branch !== branches.current) shell.exec(`git switch ${branch}`);
  });

export default checkout;
