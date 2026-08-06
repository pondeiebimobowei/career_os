import pc from 'picocolors';
import { Issue } from '../../types/backlog.js';
import { MilestoneProgress } from '../../domain/repository.js';
import { IssueService } from '../../services/issueService.js';

export class WorkRenderer {
  static render(milestone: MilestoneProgress, issue: Issue | null): void {
    console.log(pc.bold(pc.cyan('\nGood morning developer.\n')));
    console.log(pc.bold('Current Milestone'));
    console.log(`${pc.bold(pc.white(milestone.milestone))} (${milestone.percentage}% complete)\n`);

    console.log(pc.bold('Today\'s Recommendation'));
    if (issue) {
      const branchName = IssueService.formatBranchName(issue.id, issue.title);
      console.log(`Issue: ${pc.bold(pc.cyan(issue.id))} — ${issue.title}`);
      console.log(`Priority: ${pc.bold(pc.red(issue.priority || 'P0'))}`);
      console.log(`Estimated effort: ${issue.estimate || 2} pts`);
      console.log(`Dependencies: ${issue.dependencies && issue.dependencies.length > 0 ? issue.dependencies.join(', ') : 'none'}\n`);

      console.log(pc.bold('Branch'));
      console.log(pc.green(branchName) + '\n');

      console.log(pc.bold('Suggested Commands'));
      console.log(pc.cyan(`  pnpm backlog start ${issue.id}`));
      console.log(pc.cyan(`  pnpm backlog explain ${issue.id}\n`));
    } else {
      console.log(pc.green('🎉 All milestone tasks are complete! No unblocked issues remaining.\n'));
    }
  }
}
