import path from 'node:path';
import pc from 'picocolors';
import { BacklogService } from '../services/backlogService.js';
import { writeTextFile } from '../utils/fs.js';
import { logger } from '../utils/logger.js';

export async function docsCommand(options: { output?: string; cwd?: string } = {}) {
  const service = new BacklogService(options.cwd);
  const backlog = await service.load();

  const lines: string[] = [];
  lines.push(`# ${backlog.workspace.name} - Development Platform Report`);
  lines.push(`*Generated on ${new Date().toISOString().split('T')[0]}*\n`);

  lines.push(`## Executive Summary`);
  lines.push(`- **Total Domains**: ${backlog.domainFiles.length}`);
  lines.push(`- **Total Epics**: ${backlog.epics.length}`);
  lines.push(`- **Total Features**: ${backlog.features.length}`);
  lines.push(`- **Total Issues**: ${backlog.issues.length}`);
  lines.push(`- **Active Milestone**: ${backlog.workspace.current?.milestone || 'FOUNDATION'}\n`);

  lines.push(`## Milestone Breakdown`);
  const milestoneMap = new Map<string, number>();
  for (const issue of backlog.issues) {
    const ms = issue.milestone || 'UNASSIGNED';
    milestoneMap.set(ms, (milestoneMap.get(ms) || 0) + 1);
  }

  lines.push(`| Milestone | Issues Count | Target Phase |`);
  lines.push(`|---|---|---|`);
  for (const [ms, count] of milestoneMap.entries()) {
    lines.push(`| **${ms}** | ${count} | ${ms === 'FOUNDATION' ? 'Phase 1' : 'Phase 2+'} |`);
  }
  lines.push('');

  lines.push(`## Product Roadmap & Domain Coverage`);
  for (const epic of backlog.epics) {
    lines.push(`### Epic: ${epic.title} (${epic.id})`);
    if (epic.objective) lines.push(`> ${epic.objective.trim()}\n`);

    lines.push(`| Feature ID | Feature Title | Issues Count | Priority |`);
    lines.push(`|---|---|---|---|`);
    for (const feat of epic.features) {
      lines.push(`| ${feat.id} | ${feat.title} | ${feat.issues.length} | ${feat.priority || 'P1'} |`);
    }
    lines.push('');
  }

  lines.push(`## Dependency Risk & Critical Path Analysis`);
  const blocked = backlog.issues.filter((i) => i.dependencies && i.dependencies.length > 0);
  lines.push(`Found **${blocked.length}** issues with explicit dependencies:\n`);
  for (const issue of blocked.slice(0, 10)) {
    lines.push(`- **${issue.id}** (${issue.title}) ← *Waiting for: ${issue.dependencies!.join(', ')}*`);
  }

  const content = lines.join('\n');

  const outPath = options.output
    ? path.resolve(options.output)
    : path.resolve(process.cwd(), 'docs', 'backlog-report.md');

  writeTextFile(outPath, content);
  logger.success(`\n✓ Generated documentation report at: ${outPath}\n`);
}
