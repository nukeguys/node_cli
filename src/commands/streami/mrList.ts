import { Command } from "commander";
import { getGitlab, getMergeRequests } from "../../utils/gitlab";
import { GIT_LAB } from "../../../.secret";
import { MEMBERS } from "./constants";
import chalk from "chalk";

const mr = new Command("mr");

mr.description("list of open MR list")
  .option("-m, --member <member>, memeber")
  .action(async () => {
    const { member } = mr.opts();

    const gitlab = getGitlab(GIT_LAB.host, GIT_LAB.token);
    const mrs = await getMergeRequests(gitlab, {
      projectId: 22,
      state: "opened",
    });

    const infos = mrs.map((mr) => {
      const reviewers = MEMBERS.filter((member) =>
        mr.description.toLowerCase().includes(member)
      );

      return {
        title: mr.title,
        authorName: mr.author.username,
        reviewers,
        url: mr.web_url,
      };
    });

    infos.forEach((info) => {
      if (member === undefined || info.reviewers.includes(`@${member}`)) {
        console.log(
          `# ${info.title} from ${chalk.blue(
            info.authorName
          )} to [${info.reviewers
            .map((reviewer) => chalk.green(reviewer))
            .join(", ")}]`
        );
        console.log(`> ${chalk.yellow(info.url)}`);
      }
    });
  });

export default mr;
