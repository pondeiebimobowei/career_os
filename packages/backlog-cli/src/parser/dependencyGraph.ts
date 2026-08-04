import pc from 'picocolors';
import { Backlog, Issue, Epic } from '../types/backlog.js';

export class BacklogPlanner {
  static computeDependencyGraph(backlog: Backlog, mermaid: boolean = false): string {
    if (mermaid) {
      const lines: string[] = [];
      lines.push('```mermaid');
      lines.push('graph TD;');

      for (const epic of backlog.epics) {
        lines.push(`    subgraph ${epic.id}["${epic.title}"]`);
        for (const feat of epic.features) {
          for (const issue of feat.issues) {
            lines.push(`        ${issue.id}["${issue.id}: ${issue.title}"]`);
          }
        }
        lines.push('    end');
      }

      for (const issue of backlog.issues) {
        if (issue.dependencies) {
          for (const depId of issue.dependencies) {
            lines.push(`    ${depId} --> ${issue.id}`);
          }
        }
      }

      lines.push('```');
      return lines.join('\n');
    }

    const lines: string[] = [];
    lines.push(pc.bold(pc.cyan('\n=== Backlog Dependency Graph ===\n')));

    if (backlog.epics.length === 0) {
      lines.push(pc.gray('No epics found.'));
      return lines.join('\n');
    }

    for (let i = 0; i < backlog.epics.length; i++) {
      const epic = backlog.epics[i];
      lines.push(pc.bold(pc.green(epic.title)) + pc.gray(` (${epic.id})`));

      for (const feat of epic.features) {
        lines.push(`  ├─ Feature: ${pc.yellow(feat.title)} [${feat.id}]`);
        for (const issue of feat.issues) {
          const deps =
            issue.dependencies && issue.dependencies.length > 0
              ? pc.gray(` (<- ${issue.dependencies.join(', ')})`)
              : '';
          lines.push(`  │   └─ ${pc.white(issue.id)}: ${issue.title}${deps}`);
        }
      }

      if (i < backlog.epics.length - 1) {
        lines.push(pc.cyan('      │'));
        lines.push(pc.cyan('      ▼'));
      }
    }

    lines.push('\n');
    return lines.join('\n');
  }

  static getBlockedSummary(backlog: Backlog): string {
    const lines: string[] = [];
    lines.push(pc.bold(pc.cyan('\n=== Blocked Issues ===\n')));

    const blocked = backlog.issues.filter((i) => i.dependencies && i.dependencies.length > 0);
    if (blocked.length === 0) {
      lines.push(pc.green('No blocked issues found.'));
    } else {
      for (const issue of blocked) {
        lines.push(`${pc.bold(pc.yellow(issue.id))} (${issue.title})`);
        lines.push(`  Waiting for: ${pc.cyan(issue.dependencies!.join(', '))}\n`);
      }
    }

    return lines.join('\n');
  }
}
