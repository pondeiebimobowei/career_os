import { BacklogModel, Issue } from '../parser/types.js';

export type ExportFormat = 'json' | 'csv' | 'markdown' | 'pdf';

export function exportBacklog(model: BacklogModel, format: ExportFormat): string {
  switch (format) {
    case 'json':
      return JSON.stringify(
        {
          project: model.workspace.name,
          epics: model.epics,
          features: model.features,
          issues: model.issues,
        },
        null,
        2
      );

    case 'csv': {
      const headers = ['ID', 'Title', 'Type', 'Priority', 'Estimate', 'Milestone', 'Epic', 'Dependencies', 'Acceptance Criteria'];
      const rows: string[][] = [headers];

      for (const issue of model.issues) {
        rows.push([
          issue.id,
          `"${(issue.title || '').replace(/"/g, '""')}"`,
          issue.type || 'task',
          issue.priority || 'P1',
          (issue.estimate || 2).toString(),
          issue.milestone || '',
          issue.epicId || '',
          `"${(issue.dependencies || []).join(', ')}"`,
          `"${(issue.acceptance_criteria || []).join('; ')}"`,
        ]);
      }

      return rows.map((r) => r.join(',')).join('\n');
    }

    case 'markdown':
    case 'pdf': {
      const lines: string[] = [];
      lines.push(`# ${model.workspace.name} - Product Backlog`);
      lines.push(`*Generated on ${new Date().toISOString().split('T')[0]}*\n`);

      for (const epic of model.epics) {
        lines.push(`## Epic: ${epic.title} (${epic.id})`);
        if (epic.objective) lines.push(`> ${epic.objective.trim()}\n`);

        for (const feat of epic.features) {
          lines.push(`### Feature: ${feat.title} (${feat.id})`);
          lines.push(`| Issue ID | Title | Priority | Estimate | Milestone |`);
          lines.push(`|---|---|---|---|---|`);

          for (const issue of feat.issues) {
            lines.push(
              `| ${issue.id} | ${issue.title} | ${issue.priority || 'P1'} | ${issue.estimate || '-'} | ${issue.milestone || '-'} |`
            );
          }
          lines.push('');
        }
      }

      if (format === 'pdf') {
        lines.unshift('<!-- PDF EXPORT METADATA -->\n');
      }

      return lines.join('\n');
    }

    default:
      return JSON.stringify(model.issues, null, 2);
  }
}
