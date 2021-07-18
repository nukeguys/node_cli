import chalk from "chalk";
import { Command } from "commander";
import Jira from "../../common/jira";
import inquirer from "inquirer";
import { JiraIssue } from "./type";
import JiraApi from "jira-client";
import ProgressBar from "progress";

const RESOLVE_TRANSITION_NAME = "수정배포";

const dtr = new Command("dtr");

dtr
  .description('transition "Dev Done" to "Resolve" (add comment)')
  .argument("[version]", "deployed version (use in comment)")
  .option("-l, --list", "list issues only")
  .action(transitionDevDoneToResolve);

async function transitionDevDoneToResolve(version?: string) {
  const jira = await Jira.client();
  const result = await jira.searchJira("filter=Web_DevDone", {
    fields: ["key", "summary", "reporter", "assignee"],
    maxResults: 500, // maybe too many
  });
  const issues = parseIssues(result.issues);

  printIssues(issues);

  if (dtr.opts().list) return;

  const { resolve } = await inquirer.prompt([
    {
      type: "confirm",
      name: "resolve",
      message: "resolve issues? (change status, assignee & add comment)",
      default: false,
    },
  ]);

  if (!resolve) return;

  const { transitions } = await jira.listTransitions(issues[0].key);
  const transitionId = transitions.find(
    (transition: any) => transition.name === RESOLVE_TRANSITION_NAME
  )?.id;

  if (transitionId) {
    const comment = `배포완료${version ? ` (${version})` : ""}`;
    const progress = new ProgressBar("resolving [:bar] :current/:total", {
      complete: "=",
      incomplete: " ",
      width: Math.max(5, issues.length),
      total: issues.length,
    });

    issues.forEach(async issue => {
      await resolveIssue(jira, {
        issue: issue as JiraIssue,
        transitionId,
        comment,
      });
      progress.tick();
      if (progress.complete) {
        console.info(chalk.green("Done!"));
      }
    });
  } else {
    console.error(
      `There is no transition name '${chalk.red(RESOLVE_TRANSITION_NAME)}'`
    );
  }
}

function parseIssues(issues: any[]): JiraIssue[] {
  return issues.map((issue: any) => ({
    key: issue.key,
    summary: issue.fields.summary,
    assignee: {
      accountId: issue.fields.assignee.accountId,
      displayName: issue.fields.assignee.displayName,
    },
    reporter: {
      accountId: issue.fields.reporter.accountId,
      displayName: issue.fields.reporter.displayName,
    },
  }));
}

function printIssues(issues: JiraIssue[]) {
  console.info(`total ${chalk.green(issues.length)} issues.`);
  issues.forEach(issue => {
    console.info(
      `${chalk.red(issue.key)} ${issue.summary} ${chalk.blueBright(
        `<${issue.assignee.displayName}>`
      )}`
    );
  });
}

async function resolveIssue(
  jira: JiraApi,
  {
    issue,
    transitionId,
    comment,
  }: {
    issue: JiraIssue;
    transitionId: string;
    comment: string;
  }
) {
  await Promise.all([
    jira.transitionIssue(issue.key, {
      transition: { id: transitionId },
    }),
    jira.updateAssigneeWithId(issue.key, issue.reporter.accountId),
    jira.addComment(issue.key, comment),
  ]);
}

export default dtr;
