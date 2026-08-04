import { parseBacklog } from '../parser/catalog.js';
import { runDoctorDiagnostics } from '../reports/doctor.js';

export async function doctorCommand(options: { cwd?: string } = {}) {
  const startDir = options.cwd || process.cwd();
  const model = parseBacklog(startDir);
  const result = runDoctorDiagnostics(model);
  console.log(result.summaryText);
}
