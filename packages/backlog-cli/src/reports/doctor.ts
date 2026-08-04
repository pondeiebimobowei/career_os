import pc from 'picocolors';
import { BacklogModel, ValidationError } from '../parser/types.js';
import { validateBacklog } from '../validator/index.js';

export interface DoctorResult {
  summaryText: string;
  issueCount: number;
  featureCount: number;
  epicCount: number;
  problems: ValidationError[];
}

export function runDoctorDiagnostics(model: BacklogModel): DoctorResult {
  const validation = validateBacklog(model);
  const problems: ValidationError[] = [...validation.errors, ...validation.warnings];

  // Extra check: Features with no issues
  for (const feature of model.features) {
    if (!feature.issues || feature.issues.length === 0) {
      problems.push({
        type: 'HEALTH_WARNING',
        code: 'FEATURE_HAS_NO_ISSUES',
        message: `Feature ${feature.id} ("${feature.title}") has 0 issues`,
        id: feature.id,
        filePath: feature.filePath,
        severity: 'warning',
      });
    }
  }

  const lines: string[] = [];
  lines.push(pc.bold(pc.cyan('\n=== CareerOS Backlog Doctor Diagnostic ===\n')));
  lines.push(`Analyzed: ${model.epics.length} epics, ${model.features.length} features, ${model.issues.length} issues`);

  if (problems.length === 0) {
    lines.push(pc.bold(pc.green('\n✓ Backlog is in perfect health! No issues found.\n')));
  } else {
    lines.push(pc.bold(`\nFound ${problems.length} potential health items:\n`));

    const errors = problems.filter((p) => p.severity === 'error');
    const warnings = problems.filter((p) => p.severity === 'warning');

    if (errors.length > 0) {
      lines.push(pc.bold(pc.red(`ERRORS (${errors.length}):`)));
      for (const err of errors) {
        lines.push(`  ❌ [${err.code}] ${err.message}`);
      }
      lines.push('');
    }

    if (warnings.length > 0) {
      lines.push(pc.bold(pc.yellow(`WARNINGS / AUDIT CHECKS (${warnings.length}):`)));
      for (const warn of warnings) {
        lines.push(`  ⚠️  [${warn.code}] ${warn.message}`);
      }
      lines.push('');
    }
  }

  return {
    summaryText: lines.join('\n'),
    issueCount: model.issues.length,
    featureCount: model.features.length,
    epicCount: model.epics.length,
    problems,
  };
}
