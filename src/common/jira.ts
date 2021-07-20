import { getCongif, setConfig } from "./config";
import inquirer from "inquirer";
import chalk from "chalk";
import { JiraConfig } from "./type";
import { Version2Client } from "jira.js";

export type JiraClient = Version2Client;

let jiraClient: JiraClient;
async function client() {
  if (jiraClient) return jiraClient;

  const config = await getJiraConfig();
  jiraClient = getJiraClient(config);
  return jiraClient;
}

function getJiraClient(config: JiraConfig) {
  return new Version2Client({
    host: config.host,
    authentication: {
      basic: { email: config.email, apiToken: config.apiToken },
    },
    telemetry: true,
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
      message: "Jira URL(https://xxx.atlassian.net):",
    },
    {
      type: "input",
      name: "email",
      message: "email:",
    },
    {
      type: "input",
      name: "apiToken",
      message:
        "Api Token(https://id.atlassian.com/manage-profile/security/api-tokens):",
    },
  ]);

  try {
    const jiraForValidation = getJiraClient(answer);
    const user = await jiraForValidation.myself.getCurrentUser();
    console.info(
      `connect to jira: ${chalk.green(`<${user.displayName}>`)} ${
        user.accountId
      }`
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

const Jira = { client };
export default Jira;
