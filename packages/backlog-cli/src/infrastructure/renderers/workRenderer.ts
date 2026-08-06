import pc from 'picocolors';
import { Issue } from '../../types/backlog.js';
import { MilestoneProgress } from '../../domain/repository.js';
import { IssueService } from '../../services/issueService.js';
import { PlanningRecommendation } from '../../application/planningService.js';

export class WorkRenderer {
  static renderResume(activeIssue: Issue): void {
    console.log(pc.bold(pc.cyan('\nGood morning developer.\n')));
    console.log(pc.bold(pc.yellow('Active work detected\n')));
    console.log(`${pc.bold(pc.cyan(activeIssue.id))} — ${activeIssue.title}\n`);
    console.log(pc.bold('Resume:'));
    console.log(pc.cyan(`  pnpm backlog explain ${activeIssue.id}`));
    console.log(pc.cyan(`  pnpm backlog finish ${activeIssue.id}\n`));
    console.log(pc.bold('Or override:'));
    console.log(pc.gray(`  pnpm backlog work --force\n`));
  }

  static render(
    milestone: MilestoneProgress,
    recommendationOrIssue: PlanningRecommendation | Issue | null
  ): void {
    console.log(pc.bold(pc.cyan('\nGood morning developer.\n')));
    console.log(pc.bold('Current Milestone'));
    console.log(`${pc.bold(pc.white(milestone.milestone))} (${milestone.percentage}% complete)\n`);

    let issue: Issue | null = null;
    let recObj: PlanningRecommendation | null = null;

    if (recommendationOrIssue) {
      if ('nextIssue' in recommendationOrIssue) {
        recObj = recommendationOrIssue;
        issue = recommendationOrIssue.nextIssue;
      } else {
        issue = recommendationOrIssue;
      }
    }

    console.log(pc.bold("Today's Recommendation"));
    if (issue) {
      const branchName = IssueService.formatBranchName(issue.id, issue.title);
      console.log(`Issue: ${pc.bold(pc.cyan(issue.id))} — ${issue.title}`);
      console.log(`Priority: ${pc.bold(pc.red(issue.priority || 'P0'))}`);
      console.log(`Estimated effort: ${issue.estimate || 2} pts`);
      console.log(
        `Dependencies: ${
          issue.dependencies && issue.dependencies.length > 0 ? issue.dependencies.join(', ') : 'none'
        }`
      );

      if (recObj && recObj.confidencePercentage !== undefined) {
        console.log(`Recommendation Confidence: ${pc.bold(pc.green(recObj.confidencePercentage + '%'))}`);
      }

      if (recObj && recObj.factors && recObj.factors.explanations.length > 0) {
        console.log(`\n${pc.bold('Why this task?')}`);
        for (const exp of recObj.factors.explanations) {
          console.log(`  ${pc.green('✓')} ${exp.message}`);
        }
      }

      console.log(`\n${pc.bold('Branch')}`);
      console.log(pc.green(branchName) + '\n');

      console.log(pc.bold('Suggested Commands'));
      console.log(pc.cyan(`  pnpm backlog start ${issue.id}`));
      console.log(pc.cyan(`  pnpm backlog explain ${issue.id}\n`));
    } else {
      console.log(pc.green('🎉 All milestone tasks are complete! No unblocked issues remaining.\n'));
    }
  }
}
