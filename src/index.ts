import { Command } from "commander";

import { keys } from "./utils/type";
import Commands from "./commands";

const VERSION = "0.0.1";

const program = new Command();

const commandNames = keys(Commands);

// add sub commands
commandNames.forEach((command) => program.addCommand(Commands[command]));

program.version(VERSION).parse(process.argv);
