import { IssueService } from '../services/issueService.js';
import { Issue } from '../types/backlog.js';

export class GitHubPRAutomation {
  static createBranchName(issue: Issue): string {
    return IssueService.formatBranchName(issue.id, issue.title);
  }

  static formatPRBody(issue: Issue): string {
    const parts: string[] = [];
    parts.push(`## Summary\n\nFixes ${issue.id}: ${issue.title}\n`);
    parts.push(`## Related Issue\n\n- Closes #${issue.id}\n`);

    if (issue.acceptance_criteria && issue.acceptance_criteria.length > 0) {
      parts.push(`## Acceptance Criteria Checklist\n\n` + issue.acceptance_criteria.map((ac: string) => `- [ ] ${ac}`).join('\n') + '\n');
    }

    parts.push(`## Testing\n\n- [ ] Automated tests pass\n- [ ] Verified manually\n`);

    return parts.join('\n');
  }
}
