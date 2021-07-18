import chalk from "chalk";
import fs from "fs";
import { homedir } from "os";

const CONFIG_DIR = `${homedir()}/.nu`;
const CONFIG_FILE = "config.json";
const CONFIG_PATH = `${CONFIG_DIR}/${CONFIG_FILE}`;

function createConfigIfNotExist() {
  if (!fs.existsSync(CONFIG_DIR)) {
    const ret = fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({}), { encoding: "utf8" });
  }
}
export function getCongif<T = { [key in string]: any }>() {
  createConfigIfNotExist();
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) as T;
}

export function setConfig(key: string, value: any) {
  const config = getCongif();
  config[key] = value;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), {
    encoding: "utf8",
  });
  console.info(`config is set.(see ${chalk.underline(CONFIG_PATH)})`);
}
