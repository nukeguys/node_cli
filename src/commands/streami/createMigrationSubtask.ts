import inquirer from "inquirer";
import { Command } from "commander";
import { jira } from "@utils";
import { JIRA } from ".secret";

const create = new Command("create");

create.description("create subtask to migration").action(async () => {
  const { files }: { files?: string } = await inquirer.prompt([
    {
      type: "editor",
      name: "files",
      message: "enter migration files",
    },
  ]);

  if (files) {
    files
      .trim()
      .split("\n")
      .forEach(async (file) => {
        const name = file.split("/").pop();

        const jiraApi = jira.getJiraApi(JIRA);
        const { key } = await jira.creatSubTask(jiraApi, {
          summary: `[Web] ${name} 마이그레이션`,
          description: file,
          projectId: 10023,
          parentKey: "GOP-24184",
          issueTypeId: 10003,
          componentsId: 10006,
          assigneeId: "62b42f1199eafa602d89b7be",
        });
        console.log(key);
      });
  }
});

export default create;
