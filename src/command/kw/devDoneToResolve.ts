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
    fields: ["project", "key", "summary", "reporter", "assignee"],
    maxResults: 500, // maybe too many
  });

  const issues = parseIssues(result.issues);
  printIssues(issues);

  if (dtr.opts().list || issues.length === 0) return;

  const { resolve } = await inquirer.prompt([
    {
      type: "confirm",
      name: "resolve",
      message: "resolve issues? (change status, assignee & add comment)",
      default: false,
    },
  ]);
  if (!resolve) return;

  if (version) {
    const projectId = result.issues?.[0].fields.project.id;

    if (!(await isExistVersion({ jira, projectId, version }))) {
      const createdVersion = await createVersion({ jira, projectId, version });
      if (createdVersion)
        console.info(`${chalk.green(createdVersion.name)} version is created.`);
      else {
        version = undefined;
        console.info(`fail to create version`);
      }
    }
  }

  const transitionId = await getTransitionId(
    jira,
    issues[0].key,
    RESOLVE_TRANSITION_NAME
  );

  if (transitionId) {
    const progress = new ProgressBar("resolving [:bar] :current/:total", {
      complete: "=",
      incomplete: " ",
      width: issues.length,
      total: issues.length,
    });

    for (const issue of issues) {
      try {
        await resolveIssue(jira, {
          issue: issue as JiraIssue,
          transitionId,
          version,
        });
      } catch (err) {
        console.error(err.response.data.errorMessages);
      }
      progress.tick();
    }

    if (progress.complete) {
      console.info(chalk.green("Complete!"));
    } else {
      console.error(chalk.red("Something is wrong"));
    }
  } else {
    console.error(
      `There is no transition ${chalk.red(RESOLVE_TRANSITION_NAME)}`
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

async function getTransitionId(jira: JiraClient, key: string, name: string) {
  const { transitions } = await jira.issues.getTransitions({
    issueIdOrKey: key,
  });
  return transitions?.find(
    (transition: any) => transition.name === RESOLVE_TRANSITION_NAME
  )?.id;
}

async function isExistVersion({
  jira,
  projectId,
  version,
}: {
  jira: JiraClient;
  projectId: string;
  version: string;
}) {
  const versions = await jira.projectVersions.getProjectVersionsPaginated({
    projectIdOrKey: projectId,
    query: version,
  });
  return !!versions.values?.length;
}

async function createVersion({
  jira,
  projectId,
  version,
}: {
  jira: JiraClient;
  projectId: string;
  version: string;
}) {
  return await jira.projectVersions.createVersion({
    projectId: Number(projectId),
    name: version,
  });
}

async function resolveIssue(
  jira: JiraClient,
  {
    issue,
    transitionId,
    version,
  }: {
    issue: JiraIssue;
    transitionId: string;
    version?: string;
  }
) {
  const works = [
    jira.issues.doTransition({
      issueIdOrKey: issue.key,
      transition: { id: transitionId },
    }),
    jira.issues.assignIssue({
      issueIdOrKey: issue.key,
      accountId: issue.reporter.accountId,
    }),
  ];

  if (version) {
    works.push(
      jira.issues.editIssue({
        issueIdOrKey: issue.key,
        update: { fixVersions: [{ add: { name: version } }] },
      })
    );
  }

  await Promise.all(works);
}

export default dtr;
