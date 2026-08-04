import { describe, it, expect } from 'vitest';
import { IssueService } from '../services/issueService.js';
import { GitHubPRAutomation } from '../github/pullRequests.js';

describe('IssueService & Branch Automation', () => {
  it('should format branch names correctly', () => {
    const branch = IssueService.formatBranchName('APP-013', 'Create Application Form!');
    expect(branch).toBe('feature/app-013-create-application-form');
  });

  it('should format PR body template with AC checklist', () => {
    const issue: any = {
      id: 'APP-013',
      title: 'Create Application Form',
      acceptance_criteria: ['Form renders', 'Input validates'],
    };

    const prBody = GitHubPRAutomation.formatPRBody(issue);
    expect(prBody).toContain('Fixes APP-013: Create Application Form');
    expect(prBody).toContain('- [ ] Form renders');
    expect(prBody).toContain('- [ ] Input validates');
  });
});
