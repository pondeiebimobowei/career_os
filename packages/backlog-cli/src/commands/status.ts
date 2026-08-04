import { parseBacklog } from '../parser/catalog.js';
import { generateStatusReport } from '../reports/status.js';

export async function statusCommand(options: { cwd?: string } = {}) {
  const startDir = options.cwd || process.cwd();
  const model = parseBacklog(startDir);
  const report = generateStatusReport(model);
  console.log(report);
}
