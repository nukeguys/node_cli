import chalk from "chalk";
import { Command } from "commander";
import Jira, { JiraClient } from "../../common/jira";
import inquirer from "inquirer";
import { JiraIssue } from "../../common/type";
import ProgressBar from "progress";
import { IssueBean } from "jira.js/out/version2/models";

const RESOLVE_TRANSITION_NAME = "배포";

const dtr = new Command("dtr");

dtr
  .description('transition "Dev Done" to "Resolve" (add comment)')
  .argument("[version]", "deployed version (use in comment)")
  .option("-l, --list", "list issues only")
  .action(transitionDevDoneToResolve);

async function transitionDevDoneToResolve(version?: string) {
  const jira = await Jira.client();

  const result = await jira.issueSearch.searchForIssuesUsingJql({
    jql: "filter=Web_DevDone",
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

  const { transitions } = await jira.issues.getTransitions({
    issueIdOrKey: issues[0].key,
  });
  const transitionId =
    transitions?.find(
      (transition: any) => transition.name === RESOLVE_TRANSITION_NAME
    )?.id || "";

  if (transitionId) {
    const comment = `배포완료${version ? ` (${version})` : ""}`;
    const progress = new ProgressBar("resolving [:bar] :current/:total", {
      complete: "=",
      incomplete: " ",
      width: issues.length,
      total: issues.length,
    });

    issues.forEach(async issue => {
      try {
        await resolveIssue(jira, {
          issue: issue as JiraIssue,
          transitionId,
          comment,
        });
      } catch (err) {
        console.log(err.response);
      }
      progress.tick();
      if (progress.complete) {
        console.info(chalk.green("Done!"));
      }
    });
  } else {
    console.error(
      `There is no transition ${chalk.red(
        RESOLVE_TRANSITION_NAME
      )} in [${transitions?.map(t => t.name).join(", ")}]`
    );
  }
}

function parseIssues(issues?: IssueBean[]): JiraIssue[] {
  return (
    issues?.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      assignee: {
        accountId: issue.fields.assignee?.accountId || "",
        displayName: issue.fields.assignee?.displayName || "",
      },
      reporter: {
        accountId: issue.fields.reporter.accountId || "",
        displayName: issue.fields.reporter.displayName || "",
      },
    })) || []
  );
}

function printIssues(issues: JiraIssue[]) {
  console.info(`total ${chalk.green(issues.length)} issues.`);
  issues.forEach(({ key, summary, assignee: { displayName } }) => {
    console.info(
      `${chalk.red(key)} ${summary} ${chalk.blueBright(
        displayName ? `<${displayName}>` : ""
      )}`
    );
  });
}

async function resolveIssue(
  jira: JiraClient,
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
    jira.issues.doTransition({
      issueIdOrKey: issue.key,
      transition: { id: transitionId },
    }),
    jira.issues.assignIssue({
      issueIdOrKey: issue.key,
      accountId: issue.reporter.accountId,
    }),
    jira.issueComments.addComment({
      issueIdOrKey: issue.key,
      body: comment,
    }),
  ]);
}

export default dtr;
