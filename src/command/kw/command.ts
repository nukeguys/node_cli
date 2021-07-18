import { Command } from "commander";
import dtr from "./devDoneToResolve";

const kw = new Command("kw");

kw.description("commands for kakaowebtoon").addCommand(dtr);

export default kw;
