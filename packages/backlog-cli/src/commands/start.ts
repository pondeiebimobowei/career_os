import { execSync } from 'node:child_process';
import pc from 'picocolors';
import { BacklogService } from '../services/backlogService.js';
import { IssueService } from '../services/issueService.js';
import { logger } from '../utils/logger.js';

export async function startCommand(
  issueId: string,
  options: { checkout?: boolean; cwd?: string } = {}
) {
  const service = new BacklogService(options.cwd);
  const backlog = await service.load();
  const issue = backlog.issuesById.get(issueId.toUpperCase());

  if (!issue) {
    logger.error(`\nIssue "${issueId}" not found in backlog.\n`);
    process.exit(1);
  }

  const branchName = IssueService.formatBranchName(issue.id, issue.title);

  console.log(pc.bold(pc.cyan(`\nStarting Work on Issue [${issue.id}]`)));
  console.log(`Title:       ${issue.title}`);
  console.log(`Branch Name: ${pc.bold(pc.green(branchName))}\n`);

  if (options.checkout !== false) {
    try {
      execSync(`git checkout -b ${branchName}`, { stdio: 'inherit', cwd: options.cwd || process.cwd() });
      logger.success(`\n✓ Successfully created and checked out branch: ${branchName}\n`);
    } catch {
      logger.warn(`Notice: Failed to run git checkout automatically. Use command below manually:`);
      console.log(`  git checkout -b ${branchName}\n`);
    }
  } else {
    console.log(`Git Command:\n  git checkout -b ${branchName}\n`);
  }
}
