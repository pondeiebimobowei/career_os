import { Issue } from '../types/backlog.js';

export class IssueService {
  static formatGitHubIssueBody(issue: Issue): string {
    const parts: string[] = [];
    parts.push(`## Summary\n\n${issue.title}\n`);
    parts.push(`---\n\n**Priority**\n${issue.priority || 'P1'}\n`);
    parts.push(`**Estimate**\n${issue.estimate || '2'}\n`);

    if (issue.acceptance_criteria && issue.acceptance_criteria.length > 0) {
      parts.push(`---\n\n**Acceptance Criteria**\n\n` + issue.acceptance_criteria.map((ac: string) => `- [ ] ${ac}`).join('\n') + '\n');
    }

    if (issue.dependencies && issue.dependencies.length > 0) {
      parts.push(`---\n\n**Dependencies**\n\n` + issue.dependencies.map((d: string) => `- ${d}`).join('\n') + '\n');
    }

    if (issue.filePath) {
      parts.push(`---\n\n**Source**\n${issue.filePath}\n`);
    }

    return parts.join('\n');
  }

  static formatBranchName(issueId: string, title: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `feature/${issueId.toLowerCase()}-${slug}`;
  }
}
