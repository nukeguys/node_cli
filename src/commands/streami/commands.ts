import { Command } from "commander";
import epic from "./addEpicToTask";
import create from "./createMigrationSubtask";
import mr from "./mrList";

const streami = new Command("streami");
streami.description("commands for streami");

streami.addCommand(mr);
streami.addCommand(create);
streami.addCommand(epic);

export default streami;
