import inquirer from "inquirer";
import { Command } from "commander";
import { jira } from "@utils";
import { JIRA } from ".secret";

const epic = new Command("epic");

epic.description("add migration epic to task").action(async () => {
  const { tasks }: { tasks?: string } = await inquirer.prompt([
    {
      type: "editor",
      name: "tasks",
      message: "enter task list",
    },
  ]);

  if (tasks) {
    tasks
      .trim()
      .split("\n")
      .forEach(async (key) => {
        const jiraApi = jira.getJiraApi(JIRA);
        jira.updateCustomField(jiraApi, key, {
          key: "customfield_10014",
          value: "GOP-24184",
        });
      });
  }
});

export default epic;
