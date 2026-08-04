import pc from 'picocolors';
import { parseBacklog } from '../parser/catalog.js';
import { createOctokitClient } from '../github/client.js';
import { syncLabels } from '../github/labels.js';
import { syncMilestones } from '../github/milestones.js';
import { syncIssues } from '../github/issues.js';

export async function syncCommand(options: { dryRun?: boolean; cwd?: string } = {}) {
  const dryRun = !!options.dryRun;
  const startDir = options.cwd || process.cwd();

  console.log(pc.bold(pc.cyan('\nStarting Backlog GitHub Sync...\n')));
  console.log(`${pc.gray('Read workspace')} ↓`);

  const model = parseBacklog(startDir);
  console.log(`${pc.gray('Read enabled domains')} (${model.domainFiles.length} files) ↓`);
  console.log(`${pc.gray('Read issues')} (${model.issues.length} issues) ↓`);

  const { octokit, owner, repo, token } = createOctokitClient(model.workspace);

  if (!token && !dryRun) {
    console.log(pc.yellow('\nWarning: GITHUB_TOKEN or GH_TOKEN is not set in environment. Running in dry-run mode...\n'));
  }

  if (dryRun) {
    console.log(pc.bold(pc.yellow('[DRY RUN MODE ENABLED - No changes will be made to GitHub]')));
  }

  console.log(`${pc.gray('Compare GitHub')} ↓`);

  const labelResult = await syncLabels(octokit, owner, repo, model, dryRun);
  console.log(`${pc.gray('Create missing labels')} (${labelResult.labelsCreated}) ↓`);

  const milestoneResult = await syncMilestones(octokit, owner, repo, model, dryRun);
  console.log(`${pc.gray('Create missing milestones')} (${milestoneResult.milestonesCreated}) ↓`);

  const issueResult = await syncIssues(octokit, owner, repo, model, milestoneResult.milestoneMap, dryRun);
  console.log(`${pc.gray('Create & update issues')} ↓`);

  console.log(pc.bold(pc.green('\nSync complete\n')));
  console.log(`Issues created:    ${pc.bold(issueResult.issuesCreated)}`);
  console.log(`Issues updated:    ${pc.bold(issueResult.issuesUpdated)}`);
  console.log(`Labels created:    ${pc.bold(labelResult.labelsCreated)}`);
  console.log(`Milestones created: ${pc.bold(milestoneResult.milestonesCreated)}\n`);
}
