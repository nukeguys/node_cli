import { Gitlab } from "@gitbeaker/node";

type GitLabType = ReturnType<typeof getGitlab>;

export const getGitlab = (host: string, token: string) => {
  return new Gitlab({
    host,
    token,
  });
};

export const getMergeRequests = (
  gitlab: GitLabType,
  {
    projectId,
    state,
  }: { projectId: number; state: "opened" | "closed" | "locked" | "merged" }
) => {
  return gitlab.MergeRequests.all({ projectId, state });
};
