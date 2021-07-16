#!/usr/bin/env node

import { Command } from "commander";
import Commands from "./src/commands";
import { keys } from "./src/common/util";

const VERSION = "0.0.1";

const program = new Command();

const commandNames = keys(Commands);

// add sub commands
commandNames.forEach(command => program.addCommand(Commands[command]));

program.version(VERSION).parse(process.argv);
