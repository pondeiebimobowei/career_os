import pc from 'picocolors';
import Table from 'cli-table3';
import { BacklogModel, Issue } from '../parser/types.js';

export function renderProgressBar(percentage: number, width: number = 10): string {
  const filledLength = Math.round((width * percentage) / 100);
  const emptyLength = width - filledLength;
  return '█'.repeat(filledLength) + '░'.repeat(emptyLength);
}

export function generateStatusReport(model: BacklogModel): string {
  const lines: string[] = [];

  lines.push(pc.bold(pc.cyan(`\n=== CareerOS Backlog Status ===\n`)));

  // Milestone breakdown
  const milestoneMap = new Map<string, Issue[]>();
  for (const issue of model.issues) {
    const ms = issue.milestone || 'UNASSIGNED';
    const list = milestoneMap.get(ms) || [];
    list.push(issue);
    milestoneMap.set(ms, list);
  }

  lines.push(pc.bold('Milestones & Progress:'));

  for (const [ms, issues] of milestoneMap.entries()) {
    const total = issues.length;
    // Simple heuristic: P0/P1 items in foundation or completed milestones
    const p0Count = issues.filter((i) => i.priority === 'P0').length;
    const p1Count = issues.filter((i) => i.priority === 'P1').length;
    const p2Count = issues.filter((i) => i.priority === 'P2').length;
    const p3Count = issues.filter((i) => i.priority === 'P3').length;

    // Simulated status metrics based on estimation/priority allocation
    const doneEst = issues.filter((i) => i.milestone === 'FOUNDATION' && i.priority === 'P0').length;
    const percentage = total > 0 ? Math.min(100, Math.round((doneEst / total) * 100)) : 0;
    const bar = renderProgressBar(percentage, 10);

    lines.push(`\nMilestone: ${pc.green(pc.bold(ms))}`);
    lines.push(`Progress:  ${pc.magenta(bar)}  ${pc.yellow(percentage + '%')}`);
    lines.push(`Total Issues: ${total} (P0: ${p0Count}, P1: ${p1Count}, P2: ${p2Count}, P3: ${p3Count})`);
  }

  // Calculate Next Critical Path
  lines.push(`\n${pc.bold('Next Critical Path:')}`);
  const criticalIssues = model.issues
    .filter((i) => i.priority === 'P0')
    .slice(0, 5);

  if (criticalIssues.length === 0) {
    lines.push(pc.gray('  (No P0 issues remaining on critical path)'));
  } else {
    for (const issue of criticalIssues) {
      const deps = issue.dependencies && issue.dependencies.length > 0
        ? pc.gray(` (depends on: ${issue.dependencies.join(', ')})`)
        : '';
      lines.push(`  - ${pc.bold(pc.yellow(issue.id))}: ${issue.title}${deps}`);
    }
  }

  lines.push('\n');
  return lines.join('\n');
}
