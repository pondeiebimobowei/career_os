import pc from 'picocolors';
import { CommandExecutor } from '../core/commandExecutor.js';
import { Result, ok, fail } from '../core/result.js';
import { BacklogRepository } from '../domain/repository.js';
import { createGitHubClient } from '../github/github.js';
import { syncMilestones } from '../github/milestones.js';
import { syncIssues } from '../github/issues.js';

export class RepairCommand extends CommandExecutor<{ duplicatesClosed: number; issuesReconciled: number }> {
  constructor(
    private startDir: string = process.cwd(),
    private dryRun: boolean = false
  ) {
    super();
  }

  protected async run(): Promise<Result<{ duplicatesClosed: number; issuesReconciled: number }>> {
    console.log(pc.bold(pc.cyan('\n=== GitHub Backlog Repair & Reconciliation ===\n')));

    const repository = new BacklogRepository(this.startDir);
    const backlogRes = await repository.load();
    if (!backlogRes.success) return backlogRes;

    const { octokit, owner, repo } = createGitHubClient(backlogRes.data.workspace);
    if (!octokit || this.dryRun) {
      if (!octokit) {
        console.log(pc.yellow('⚠ GitHub authentication token not set. Run "gh auth login" or set GITHUB_TOKEN.\n'));
      } else {
        console.log(pc.cyan('ℹ Dry run mode: skipping network reconciliation calls.\n'));
      }
      return ok({ duplicatesClosed: 0, issuesReconciled: 0 });
    }

    console.log(pc.bold('1. Syncing Milestones...'));
    const { milestoneMap } = await syncMilestones(octokit, owner, repo, backlogRes.data, false);
    console.log(`   ✓ Milestones reconciled (${milestoneMap.size} milestones)\n`);

    console.log(pc.bold('2. Repairing GitHub Issues & Closing Duplicates...'));
    const res = await syncIssues(
      octokit,
      owner,
      repo,
      backlogRes.data,
      milestoneMap,
      false
    );

    console.log(`   ✓ Duplicates closed:   ${pc.bold(pc.yellow(String(res.duplicatesClosed)))}`);
    console.log(`   ✓ Issues reconciled:   ${pc.bold(pc.green(String(res.issuesUpdated)))}`);
    console.log(`   ✓ New issues created:  ${pc.bold(pc.cyan(String(res.issuesCreated)))}\n`);

    console.log(pc.bold(pc.green('✔ GitHub state successfully repaired and synchronized with canonical YAML backlog.\n')));
    return ok({ duplicatesClosed: res.duplicatesClosed, issuesReconciled: res.issuesUpdated });
  }
}

export async function repairCommand(options: { cwd?: string; dryRun?: boolean } = {}) {
  const command = new RepairCommand(options.cwd, options.dryRun);
  await command.execute(options.cwd);
}
