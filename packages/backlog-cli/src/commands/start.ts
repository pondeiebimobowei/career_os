import pc from 'picocolors';
import { BacklogService } from '../services/backlogService.js';
import { IssueService } from '../services/issueService.js';

export async function startCommand(issueId: string, options: { cwd?: string } = {}) {
  const service = new BacklogService(options.cwd);
  const backlog = await service.load();
  const issue = backlog.issuesById.get(issueId.toUpperCase());

  if (!issue) {
    console.log(pc.red(`\nIssue "${issueId}" not found in backlog.\n`));
    process.exit(1);
  }

  const branchName = IssueService.formatBranchName(issue.id, issue.title);

  console.log(pc.bold(pc.cyan(`\nStarting Issue [${issue.id}]`)));
  console.log(`Title:       ${issue.title}`);
  console.log(`Branch Name: ${pc.bold(pc.green(branchName))}\n`);

  console.log(pc.bold('Git Command:'));
  console.log(`  git checkout -b ${branchName}\n`);
}
