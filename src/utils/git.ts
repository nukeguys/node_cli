import shell from "shelljs";

export const getBranches = ({
  all = false,
  filter,
}: {
  all?: boolean;
  filter?: string;
}): { list: string[]; current: string } | undefined => {
  const cmd = `git branch ${all ? "-a" : ""} ${
    filter ? `| grep ${filter}` : ""
  }`;

  const result = shell.exec(cmd, { silent: true });
  if (result.code !== 0) {
    console.error(result.stderr);
    return;
  }

  const list = result
    .trim()
    .split("\n")
    .map((line) => line.trim().replace("* ", ""));

  return {
    list,
    current: getCurrentBranch(),
  };
};

export const getCurrentBranch = () => {
  const cmd = `git rev-parse --abbrev-ref HEAD`;
  const result = shell.exec(cmd, { silent: true });
  if (result.code !== 0) return "";

  return result.stdout.split("\n")[0];
};
