import pc from 'picocolors';
import { BacklogModel } from '../parser/types.js';

export function generateDependencyGraph(model: BacklogModel, mermaid: boolean = false): string {
  if (mermaid) {
    const lines: string[] = [];
    lines.push('```mermaid');
    lines.push('graph TD;');

    // Map Epics
    for (const epic of model.epics) {
      lines.push(`    subgraph ${epic.id}["${epic.title}"]`);
      for (const feat of epic.features) {
        for (const issue of feat.issues) {
          lines.push(`        ${issue.id}["${issue.id}: ${issue.title}"]`);
        }
      }
      lines.push('    end');
    }

    // Map issue dependencies
    for (const issue of model.issues) {
      if (issue.dependencies) {
        for (const depId of issue.dependencies) {
          lines.push(`    ${depId} --> ${issue.id}`);
        }
      }
    }

    lines.push('```');
    return lines.join('\n');
  }

  // ASCII Domain / Epic flow
  const lines: string[] = [];
  lines.push(pc.bold(pc.cyan('\n=== Backlog Dependency Graph ===\n')));

  if (model.epics.length === 0) {
    lines.push(pc.gray('No epics found.'));
    return lines.join('\n');
  }

  for (let i = 0; i < model.epics.length; i++) {
    const epic = model.epics[i];
    lines.push(pc.bold(pc.green(epic.title)) + pc.gray(` (${epic.id})`));
    
    // List features & top issues
    for (const feat of epic.features) {
      lines.push(`  ├─ Feature: ${pc.yellow(feat.title)} [${feat.id}]`);
      for (const issue of feat.issues) {
        const deps = issue.dependencies && issue.dependencies.length > 0 ? pc.gray(` (<- ${issue.dependencies.join(', ')})`) : '';
        lines.push(`  │   └─ ${pc.white(issue.id)}: ${issue.title}${deps}`);
      }
    }

    if (i < model.epics.length - 1) {
      lines.push(pc.cyan('      │'));
      lines.push(pc.cyan('      ▼'));
    }
  }

  lines.push('\n');
  return lines.join('\n');
}
