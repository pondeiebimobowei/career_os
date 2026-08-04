export interface GitHubLabel {
  name: string;
  color: string;
  description?: string;
}

export interface GitHubMilestone {
  number: number;
  title: string;
  description?: string;
  state: 'open' | 'closed';
  due_on?: string | null;
}

export interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: Array<{ name: string }>;
  milestone: { title: string; number: number } | null;
}

export interface SyncSummary {
  issuesCreated: number;
  issuesUpdated: number;
  issuesClosed: number;
  labelsCreated: number;
  milestonesCreated: number;
  dryRun: boolean;
}
