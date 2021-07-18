export interface JiraIssue {
  key: string;
  summary: string;
  assignee: {
    accountId: string;
    displayName: string;
  };
  reporter: {
    accountId: string;
    displayName: string;
  };
}
