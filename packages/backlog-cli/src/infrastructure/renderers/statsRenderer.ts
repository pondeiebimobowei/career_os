import pc from 'picocolors';
import { EngineeringMetrics } from '../../application/metricsCalculator.js';

export class StatsRenderer {
  static render(metrics: EngineeringMetrics): void {
    console.log(pc.bold(pc.cyan('\n=== Engineering Telemetry & Metrics ===\n')));
    console.log(`Total Backlog Issues:     ${metrics.totalIssues}`);
    console.log(`Completed Issues:         ${pc.green(String(metrics.completedIssues))}`);
    console.log(`Remaining Issues:         ${pc.yellow(String(metrics.remainingIssues))}`);
    console.log(`Work In Progress (WIP):   ${pc.cyan(String(metrics.workInProgressCount))}`);
    console.log(`Blocked Bottlenecks:      ${metrics.blockedCount === 0 ? pc.green('0') : pc.red(String(metrics.blockedCount))}\n`);

    console.log(pc.bold('Performance Telemetry:'));
    console.log(`Velocity:                ${metrics.velocityIssuesPerDay} issues/day`);
    console.log(`Average Cycle Time:       ${metrics.averageCycleTimeDays} days`);
    console.log(`Average Lead Time:        ${metrics.averageLeadTimeDays} days\n`);
  }
}
