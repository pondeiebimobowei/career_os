import pc from 'picocolors';
import { EngineeringMetrics } from '../../application/metricsCalculator.js';
import { MilestoneProgress } from '../../domain/repository.js';
import { Issue } from '../../types/backlog.js';

export class DashboardRenderer {
  static render(
    milestone: MilestoneProgress,
    metrics: EngineeringMetrics,
    nextIssue: Issue | null,
    criticalPath: Issue[]
  ): void {
    const totalBars = 20;
    const filledBars = Math.round((milestone.percentage / 100) * totalBars);
    const progressBar = '█'.repeat(filledBars) + '░'.repeat(totalBars - filledBars);

    console.log(pc.bold(pc.cyan('\nCareerOS Executive Dashboard\n')));
    console.log(pc.bold('══════════════════════════════════════════════════\n'));
    console.log(pc.bold('Current Milestone'));
    console.log(`${pc.green(progressBar)} ${pc.bold(pc.yellow(`${milestone.percentage}%`))}`);
    console.log(pc.bold(pc.white(milestone.milestone)));
    console.log(pc.dim('──────────────────────────────────────────────────\n'));

    console.log(pc.bold('Velocity'));
    console.log(`${metrics.velocityIssuesPerDay} issues/day\n`);

    console.log(pc.bold('Cycle Time'));
    console.log(`${metrics.averageCycleTimeDays} days\n`);

    console.log(pc.bold('Lead Time'));
    console.log(`${metrics.averageLeadTimeDays} days`);
    console.log(pc.dim('──────────────────────────────────────────────────\n'));

    console.log(pc.bold('Next Recommendation'));
    if (nextIssue) {
      console.log(`${pc.bold(pc.cyan(nextIssue.id))}: ${nextIssue.title}`);
      console.log(`Priority: ${pc.bold(pc.red(nextIssue.priority || 'P0'))}\n`);
    } else {
      console.log(pc.green('All milestone issues completed!\n'));
    }

    console.log(pc.bold('Blockers'));
    console.log(metrics.blockedCount === 0 ? pc.green('None\n') : pc.red(`${metrics.blockedCount} blocked issues\n`));

    console.log(pc.bold('Critical Path'));
    if (criticalPath.length > 0) {
      console.log(criticalPath.slice(0, 3).map((i) => i.id).join(pc.dim('  ↓  ')) + '\n');
    } else {
      console.log(pc.dim('No critical path dependencies\n'));
    }

    console.log(pc.dim('──────────────────────────────────────────────────\n'));
    console.log(pc.bold('Overall Progress'));
    console.log(`Total Issues: ${metrics.totalIssues}`);
    console.log(`Complete:     ${pc.green(String(metrics.completedIssues))}`);
    console.log(`Remaining:    ${pc.yellow(String(metrics.remainingIssues))}\n`);
  }
}
