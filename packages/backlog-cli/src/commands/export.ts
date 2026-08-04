import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { parseBacklog } from '../parser/catalog.js';
import { exportBacklog, ExportFormat } from '../reports/export.js';

export async function exportCommand(options: { format?: string; output?: string; cwd?: string } = {}) {
  const startDir = options.cwd || process.cwd();
  const rawFormat = (options.format || 'json').toLowerCase();
  const format: ExportFormat = ['json', 'csv', 'markdown', 'pdf'].includes(rawFormat)
    ? (rawFormat as ExportFormat)
    : 'json';

  const model = parseBacklog(startDir);
  const content = exportBacklog(model, format);

  if (options.output) {
    const outPath = path.resolve(options.output);
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(pc.green(`\n✓ Exported backlog to ${outPath} (${format.toUpperCase()})\n`));
  } else {
    console.log(content);
  }
}
