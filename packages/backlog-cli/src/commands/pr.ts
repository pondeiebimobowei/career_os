import pc from 'picocolors';
import { BacklogService } from '../services/backlogService.js';
import { GitHubPRAutomation } from '../github/pullRequests.js';

export async function prCommand(issueId: string, options: { cwd?: string } = {}) {
  const service = new BacklogService(options.cwd);
  const backlog = await service.load();
  const issue = backlog.issuesById.get(issueId.toUpperCase());

  if (!issue) {
    console.log(pc.red(`\nIssue "${issueId}" not found in backlog.\n`));
    process.exit(1);
  }

  const prTitle = `[${issue.id}] ${issue.title}`;
  const prBody = GitHubPRAutomation.formatPRBody(issue);

  console.log(pc.bold(pc.cyan('\n=== Generated Pull Request ===\n')));
  console.log(pc.bold('Title:'));
  console.log(prTitle);
  console.log(pc.bold('\nBody:'));
  console.log(prBody);
}
