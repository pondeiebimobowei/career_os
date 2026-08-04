import pc from 'picocolors';
import { Backlog, Issue } from '../types/backlog.js';

export function renderProgressBar(percentage: number, width: number = 10): string {
  const filledLength = Math.round((width * percentage) / 100);
  const emptyLength = width - filledLength;
  return '█'.repeat(filledLength) + '░'.repeat(emptyLength);
}

export class MilestoneService {
  static generateStatusReport(backlog: Backlog): string {
    const lines: string[] = [];
    lines.push(pc.bold(pc.cyan(`\n=== CareerOS Backlog Status ===\n`)));

    const milestoneMap = new Map<string, Issue[]>();
    for (const issue of backlog.issues) {
      const ms = issue.milestone || 'UNASSIGNED';
      const list = milestoneMap.get(ms) || [];
      list.push(issue);
      milestoneMap.set(ms, list);
    }

    lines.push(pc.bold('Milestones & Progress:'));

    let totalDone = 0;
    let totalTodo = 0;
    let totalBlocked = 0;
    let totalInProgress = 0;

    for (const [ms, issues] of milestoneMap.entries()) {
      const total = issues.length;
      const done = issues.filter((i) => i.milestone === 'FOUNDATION' && i.priority === 'P0').length;
      const blocked = issues.filter((i) => i.dependencies && i.dependencies.length > 0).length;
      const todo = total - done;

      totalDone += done;
      totalTodo += todo;
      totalBlocked += blocked;

      const percentage = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
      const bar = renderProgressBar(percentage, 10);

      lines.push(`\nMilestone: ${pc.green(pc.bold(ms))}`);
      lines.push(`Progress:  ${pc.magenta(bar)}  ${pc.yellow(percentage + '%')}`);
      lines.push(`Total Issues: ${total} (Done: ${done}, Todo: ${todo}, Blocked: ${blocked})`);
    }

    lines.push(pc.bold(`\nOverall Summary:`));
    lines.push(`  Done:        ${pc.green(totalDone)}`);
    lines.push(`  In Progress: ${pc.cyan(totalInProgress)}`);
    lines.push(`  Todo:        ${pc.yellow(totalTodo)}`);
    lines.push(`  Blocked:     ${pc.red(totalBlocked)}`);

    lines.push(`\n${pc.bold('Next Critical Path:')}`);
    const critical = backlog.issues.filter((i) => i.priority === 'P0').slice(0, 5);
    for (const issue of critical) {
      const deps = issue.dependencies && issue.dependencies.length > 0 ? pc.gray(` (depends on: ${issue.dependencies.join(', ')})`) : '';
      lines.push(`  - ${pc.bold(pc.yellow(issue.id))}: ${issue.title}${deps}`);
    }

    lines.push('\n');
    return lines.join('\n');
  }
}
