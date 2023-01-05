import { Command } from "commander";
import mr from "./mrList";

const streami = new Command("streami");
streami.description("commands for streami");

streami.addCommand(mr);

export default streami;
