import { GitAdapter } from '../infrastructure/git/adapter.js';
import { Backlog, Issue } from '../types/backlog.js';

export class ResumeDetectionService {
  /**
   * Parses an issue ID (e.g., PROFILE-003) from a git branch name.
   */
  static parseBranchName(branchName: string): string | null {
    if (!branchName) return null;
    const match = branchName.match(/(?:feature\/)?([a-zA-Z]+-\d+)/i);
    return match ? match[1].toUpperCase() : null;
  }

  /**
   * Detects if the current git repository branch corresponds to an active, unfinished backlog issue.
   */
  static detectActiveIssue(startDir: string, backlog: Backlog): Issue | null {
    const gitStatusRes = GitAdapter.getStatus(startDir);
    if (!gitStatusRes.success || !gitStatusRes.data.branch) {
      return null;
    }

    const branchName = gitStatusRes.data.branch;
    const issueId = this.parseBranchName(branchName);
    if (!issueId) return null;

    const issue = backlog.issuesById.get(issueId);
    if (!issue) return null;

    const isDone = (issue.status || '').toLowerCase() === 'done';
    if (isDone) return null;

    return issue;
  }
}
