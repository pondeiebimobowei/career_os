import pc from 'picocolors';
import { BacklogService } from '../services/backlogService.js';
import { GitHubSynchronizer } from '../services/githubSynchronizer.js';
import { logger } from '../utils/logger.js';

export async function syncCommand(options: { dryRun?: boolean; cwd?: string } = {}) {
  const service = new BacklogService(options.cwd);
  const backlog = await service.load();

  logger.info('\nStarting Backlog GitHub Sync...\n');
  logger.step('Read workspace');
  logger.step('Read enabled domains', `${backlog.domainFiles.length} files`);
  logger.step('Read issues', `${backlog.issues.length} issues`);

  if (options.dryRun) {
    logger.warn('[DRY RUN MODE ENABLED - No changes will be made to GitHub]');
  }

  logger.step('Compare GitHub');

  const summary = await GitHubSynchronizer.sync(backlog, { dryRun: options.dryRun });

  logger.step('Create missing labels', summary.labelsCreated);
  logger.step('Create missing milestones', summary.milestonesCreated);
  logger.step('Create & update issues');

  logger.success('\nSync complete\n');
  console.log(`Issues created:    ${pc.bold(summary.issuesCreated)}`);
  console.log(`Issues updated:    ${pc.bold(summary.issuesUpdated)}`);
  console.log(`Labels created:    ${pc.bold(summary.labelsCreated)}`);
  console.log(`Milestones created: ${pc.bold(summary.milestonesCreated)}\n`);
}
