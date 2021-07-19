export interface JiraConfig {
  host: string;
  email: string;
  apiToken: string;
}

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

export interface JiraTransition {
  id: string;
  name: string;
  // to, hasScreen, isGlobal, isInitial, isAvailable, isConditional, fields, isLooped
}
