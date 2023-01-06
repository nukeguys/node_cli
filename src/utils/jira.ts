import JiraApi from "jira-client";

export const getJiraApi = ({
  host,
  username,
  token,
}: {
  host: string;
  username: string;
  token: string;
}) => {
  return new JiraApi({
    protocol: "https",
    host,
    username,
    password: token,
    apiVersion: "2",
    strictSSL: true,
  });
};

export const creatSubTask = async (
  jiraApi: JiraApi,
  {
    summary,
    description,
    projectId,
    parentKey,
    issueTypeId,
    componentsId,
    assigneeId,
  }: {
    summary: string;
    description?: string;
    projectId: number;
    parentKey: string;
    issueTypeId: number;
    componentsId?: number;
    assigneeId: string;
  }
): Promise<{ id: number; key: string }> => {
  const { id, key } = await jiraApi.addNewIssue({
    fields: {
      summary,
      description,
      project: { id: projectId },
      parent: { key: parentKey },
      issuetype: { id: issueTypeId },
      components: [{ id: componentsId }],
      assignee: { id: assigneeId },
    },
  });

  return { id, key };
};

export const updateCustomField = (
  jiraApi: JiraApi,
  issueKey: string,
  fields: { key: string; value: string }
) => {
  jiraApi.updateIssue(issueKey, {
    fields: {
      [fields.key]: fields.value,
    },
  });
};
