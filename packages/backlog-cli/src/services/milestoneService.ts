import pc from 'picocolors';
import { Backlog, Issue } from '../types/backlog.js';
import { PlanningService } from '../application/planningService.js';

export function renderProgressBar(percentage: number, width: number = 10): string {
  const filledLength = Math.round((width * percentage) / 100);
  const emptyLength = width - filledLength;
  return '█'.repeat(filledLength) + '░'.repeat(emptyLength);
}

export class MilestoneService {
  static generateStatusReport(backlog: Backlog): string {
    const lines: string[] = [];
    lines.push(pc.bold(pc.cyan(`\n=== CareerOS Backlog Status ===\n`)));

    const completedIssueIds = new Set<string>();
    for (const issue of backlog.issues) {
      if (
        (issue.status || '').toLowerCase() === 'done' ||
        (issue.lifecycle?.phase || '').toLowerCase() === 'done'
      ) {
        completedIssueIds.add(issue.id);
      }
    }

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
      let done = 0;
      let inProgress = 0;
      let blocked = 0;
      let todo = 0;

      for (const issue of issues) {
        const isDone = completedIssueIds.has(issue.id);
        if (isDone) {
          done++;
          continue;
        }
        if ((issue.status || '').toLowerCase() === 'in_progress') {
          inProgress++;
          continue;
        }

        const hasUnfinishedDeps = (issue.dependencies || []).some((depId) => !completedIssueIds.has(depId));
        if (hasUnfinishedDeps || (issue.status || '').toLowerCase() === 'blocked') {
          blocked++;
        } else {
          todo++;
        }
      }

      totalDone += done;
      totalInProgress += inProgress;
      totalTodo += todo;
      totalBlocked += blocked;

      const percentage = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
      const bar = renderProgressBar(percentage, 10);

      lines.push(`\nMilestone: ${pc.green(pc.bold(ms))}`);
      lines.push(`Progress:  ${pc.magenta(bar)}  ${pc.yellow(percentage + '%')}`);
      lines.push(`${total} issues`);
      lines.push(`  ${pc.green('✓')} ${done} completed`);
      lines.push(`  ${pc.cyan('•')} ${todo + inProgress} ready`);
      lines.push(`  ${pc.red('⛔')} ${blocked} blocked`);
    }

    lines.push(pc.bold(`\nOverall Summary:`));
    lines.push(`  Done:        ${pc.green(totalDone)}`);
    lines.push(`  In Progress: ${pc.cyan(totalInProgress)}`);
    lines.push(`  Todo:        ${pc.yellow(totalTodo)}`);
    lines.push(`  Blocked:     ${pc.red(totalBlocked)}`);

    const bottlenecks = PlanningService.getImpactOrderedBottlenecks(backlog);
    lines.push(`\n${pc.bold('Current bottlenecks')}`);

    if (bottlenecks.length === 0) {
      lines.push(pc.green('  None! No active blockers found.'));
    } else {
      for (const b of bottlenecks) {
        lines.push(`\n${pc.bold(pc.yellow(b.blocker.id))} — ${b.blocker.title}`);
        lines.push(`blocks:`);
        for (const blockedIssue of b.blockedIssues) {
          lines.push(`  • ${blockedIssue.id} — ${blockedIssue.title}`);
        }
      }
    }

    lines.push(`\n${pc.bold('Next Critical Path:')}`);
    const critical = backlog.issues
      .filter((i) => !completedIssueIds.has(i.id))
      .filter((i) => !(i.dependencies || []).some((depId) => !completedIssueIds.has(depId)))
      .sort((a, b) => {
        const pOrder: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
        return (pOrder[a.priority || 'P1'] ?? 9) - (pOrder[b.priority || 'P1'] ?? 9);
      })
      .slice(0, 5);

    if (critical.length === 0) {
      lines.push(pc.green('  None! All critical path tasks completed.'));
    } else {
      for (const issue of critical) {
        const deps =
          issue.dependencies && issue.dependencies.length > 0
            ? pc.gray(` (depends on: ${issue.dependencies.join(', ')})`)
            : '';
        lines.push(`  - ${pc.bold(pc.yellow(issue.id))}: ${issue.title}${deps}`);
      }
    }

    lines.push('\n');
    return lines.join('\n');
  }
}
