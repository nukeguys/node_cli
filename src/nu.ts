import { Command } from "commander";
import Commands from "./commands";
import { keys } from "./common/util";

const VERSION = "0.0.1";

const program = new Command();

const commandNames = keys(Commands);

// add sub commands
commandNames.forEach(command => program.addCommand(Commands[command]));

program.version(VERSION).parse(process.argv);
