#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var commands_1 = __importDefault(require("./src/commands"));
var util_1 = require("./src/common/util");
var VERSION = "0.0.1";
var program = new commander_1.Command();
var commandNames = util_1.keys(commands_1.default);
// add sub commands
commandNames.forEach(function (command) { return program.addCommand(commands_1.default[command]); });
program.version(VERSION).parse(process.argv);
