import { createGitHubClient } from '../github/github.js';
import { syncLabels } from '../github/labels.js';
import { syncMilestones } from '../github/milestones.js';
import { syncIssues } from '../github/issues.js';
import { Backlog } from '../types/backlog.js';
import { SyncSummary } from '../types/github.js';

export class GitHubSynchronizer {
  static async sync(backlog: Backlog, options: { dryRun?: boolean } = {}): Promise<SyncSummary> {
    const dryRun = !!options.dryRun;
    const { octokit, owner, repo } = createGitHubClient(backlog.workspace);

    const labelRes = await syncLabels(octokit, owner, repo, backlog, dryRun);
    const milestoneRes = await syncMilestones(octokit, owner, repo, backlog, dryRun);
    const issueRes = await syncIssues(octokit, owner, repo, backlog, milestoneRes.milestoneMap, dryRun);

    return {
      issuesCreated: issueRes.issuesCreated,
      issuesUpdated: issueRes.issuesUpdated,
      issuesClosed: 0,
      labelsCreated: labelRes.labelsCreated,
      milestonesCreated: milestoneRes.milestonesCreated,
      dryRun,
    };
  }
}
