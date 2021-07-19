import JiraApi from "jira-client";
import { getCongif, setConfig } from "./config";
import inquirer from "inquirer";
import chalk from "chalk";
import { JiraIssue, JiraTransition } from "./type";

interface JiraConfig {
  host: string;
  email: string;
  token: string;
}

let jiraApi: JiraApi;
async function client() {
  if (jiraApi) return jiraApi;

  const config = await getJiraConfig();
  jiraApi = getJiraApi(config);
  return jiraApi;
}

function getJiraApi(config: JiraConfig) {
  return new JiraApi({
    protocol: "https",
    apiVersion: "2",
    strictSSL: true,
    host: config.host,
    username: config.email,
    password: config.token,
  });
}

async function getJiraConfig() {
  const { jira } = getCongif<{ jira: JiraConfig }>();

  if (!jira) {
    console.info(chalk.green("no jira config, please config it first"));
    const config = await initJiraConfig();
    setConfig("jira", config);
    return config;
  }
  return jira;
}

async function initJiraConfig() {
  const answer = await inquirer.prompt<JiraConfig>([
    {
      type: "input",
      name: "host",
      message: "Jira URL(xxx.atlassian.net):",
    },
    {
      type: "input",
      name: "email",
      message: "email:",
    },
    {
      type: "input",
      name: "token",
      message:
        "Api Token(https://id.atlassian.com/manage-profile/security/api-tokens):",
    },
  ]);

  try {
    const jiraForValidation = getJiraApi(answer);
    const user = await jiraForValidation.getCurrentUser();
    console.info(
      `connect to jira: ${chalk.green(user.displayName)} / ${user.accountId}`
    );
    return answer;
  } catch (error) {
    throw new Error(
      `can not connect to jira, please check your config\n${chalk.red(
        JSON.stringify(answer)
      )}`
    );
  }
}

export async function getIssueTransitions(jira: JiraApi, issue: JiraIssue) {
  const { transitions } = await jira.listTransitions(issue.key);
  return transitions as JiraTransition[];
}

const Jira = { client };
export default Jira;
