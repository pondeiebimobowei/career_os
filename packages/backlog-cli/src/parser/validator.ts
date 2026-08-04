import path from 'node:path';
import { Backlog, ValidationProblem } from '../types/backlog.js';
import { STANDARD_LABELS, StandardMilestones } from '../schema/enums.js';

export interface ValidationSummary {
  backlog: Backlog;
  errors: ValidationProblem[];
  warnings: ValidationProblem[];
  isValid: boolean;
}

export class BacklogValidator {
  static validate(backlog: Backlog): ValidationSummary {
    const problems: ValidationProblem[] = [...backlog.parseErrors];

    problems.push(...this.validateIDUniqueness(backlog));
    problems.push(...this.validateDependencies(backlog));
    problems.push(...this.validateMilestones(backlog));
    problems.push(...this.validateIssuesAndFeatures(backlog));

    const errors = problems.filter((p) => p.severity === 'error');
    const warnings = problems.filter((p) => p.severity === 'warning');

    return {
      backlog,
      errors,
      warnings,
      isValid: errors.length === 0,
    };
  }

  private static validateIDUniqueness(backlog: Backlog): ValidationProblem[] {
    const problems: ValidationProblem[] = [];
    const issueLocations = new Map<string, string[]>();

    for (const issue of backlog.issues) {
      const file = issue.filePath ? path.basename(issue.filePath) : 'unknown';
      const list = issueLocations.get(issue.id) || [];
      list.push(file);
      issueLocations.set(issue.id, list);
    }

    for (const [id, locs] of issueLocations.entries()) {
      if (locs.length > 1) {
        problems.push({
          type: 'ID_DUPLICATE',
          code: 'DUPLICATE_ISSUE_ID',
          message: `Duplicate issue ID "${id}" found in files: ${locs.join(', ')}`,
          id,
          severity: 'error',
        });
      }
    }

    const featureLocations = new Map<string, string[]>();
    for (const feat of backlog.features) {
      const file = feat.filePath ? path.basename(feat.filePath) : 'unknown';
      const list = featureLocations.get(feat.id) || [];
      list.push(file);
      featureLocations.set(feat.id, list);
    }

    for (const [id, locs] of featureLocations.entries()) {
      if (locs.length > 1) {
        problems.push({
          type: 'ID_DUPLICATE',
          code: 'DUPLICATE_FEATURE_ID',
          message: `Duplicate feature ID "${id}" found in files: ${locs.join(', ')}`,
          id,
          severity: 'error',
        });
      }
    }

    return problems;
  }

  private static validateDependencies(backlog: Backlog): ValidationProblem[] {
    const problems: ValidationProblem[] = [];

    for (const issue of backlog.issues) {
      if (!issue.dependencies || issue.dependencies.length === 0) continue;

      for (const depId of issue.dependencies) {
        if (!backlog.issuesById.has(depId) && !backlog.epicsById.has(depId) && !backlog.featuresById.has(depId)) {
          problems.push({
            type: 'DEPENDENCY_NOT_FOUND',
            code: 'MISSING_DEPENDENCY',
            message: `Issue ${issue.id} depends on non-existent issue "${depId}"`,
            id: issue.id,
            filePath: issue.filePath,
            severity: 'error',
          });
        }
      }
    }

    // Cycle detection
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (currId: string, trace: string[]): boolean => {
      visited.add(currId);
      recStack.add(currId);
      trace.push(currId);

      const iss = backlog.issuesById.get(currId);
      if (iss && iss.dependencies) {
        for (const depId of iss.dependencies) {
          if (!visited.has(depId)) {
            if (dfs(depId, trace)) return true;
          } else if (recStack.has(depId)) {
            const cycleStr = [...trace.slice(trace.indexOf(depId)), depId].join(' -> ');
            problems.push({
              type: 'CIRCULAR_DEPENDENCY',
              code: 'CIRCULAR_DEPENDENCY',
              message: `Circular dependency detected: ${cycleStr}`,
              id: currId,
              filePath: iss.filePath,
              severity: 'error',
            });
            return true;
          }
        }
      }

      recStack.delete(currId);
      trace.pop();
      return false;
    };

    for (const issue of backlog.issues) {
      if (!visited.has(issue.id)) {
        dfs(issue.id, []);
      }
    }

    return problems;
  }

  private static validateMilestones(backlog: Backlog): ValidationProblem[] {
    const problems: ValidationProblem[] = [];
    const validMs = Object.values(StandardMilestones);

    for (const epic of backlog.epics) {
      if (epic.milestone && !validMs.includes(epic.milestone as any)) {
        problems.push({
          type: 'MILESTONE_INVALID',
          code: 'UNKNOWN_MILESTONE',
          message: `Epic ${epic.id} has unknown milestone "${epic.milestone}"`,
          id: epic.id,
          filePath: epic.filePath,
          severity: 'warning',
        });
      }
    }

    for (const issue of backlog.issues) {
      if (issue.milestone && !validMs.includes(issue.milestone as any)) {
        problems.push({
          type: 'MILESTONE_INVALID',
          code: 'UNKNOWN_MILESTONE',
          message: `Issue ${issue.id} has unknown milestone "${issue.milestone}"`,
          id: issue.id,
          filePath: issue.filePath,
          severity: 'warning',
        });
      }
    }

    return problems;
  }

  private static validateIssuesAndFeatures(backlog: Backlog): ValidationProblem[] {
    const problems: ValidationProblem[] = [];
    const requireAc = backlog.workspace.rules?.require_acceptance_criteria ?? true;

    for (const feat of backlog.features) {
      if (!feat.issues || feat.issues.length === 0) {
        problems.push({
          type: 'HEALTH_WARNING',
          code: 'FEATURE_HAS_NO_ISSUES',
          message: `Feature ${feat.id} ("${feat.title}") has 0 issues`,
          id: feat.id,
          filePath: feat.filePath,
          severity: 'warning',
        });
      }
    }

    for (const issue of backlog.issues) {
      if (!issue.id) {
        problems.push({
          type: 'SCHEMA',
          code: 'MISSING_ID',
          message: `Issue in file ${issue.filePath} is missing an ID`,
          filePath: issue.filePath,
          severity: 'error',
        });
      }

      if (!issue.title || issue.title.trim().length === 0) {
        problems.push({
          type: 'SCHEMA',
          code: 'MISSING_TITLE',
          message: `Issue ${issue.id} has no title`,
          id: issue.id,
          filePath: issue.filePath,
          severity: 'error',
        });
      }

      if (issue.priority && !['P0', 'P1', 'P2', 'P3'].includes(issue.priority)) {
        problems.push({
          type: 'SCHEMA',
          code: 'INVALID_PRIORITY',
          message: `Issue ${issue.id} has invalid priority: ${issue.priority}`,
          id: issue.id,
          filePath: issue.filePath,
          severity: 'error',
        });
      }

      if (requireAc && (!issue.acceptance_criteria || issue.acceptance_criteria.length === 0)) {
        problems.push({
          type: 'HEALTH_WARNING',
          code: 'MISSING_ACCEPTANCE_CRITERIA',
          message: `Issue ${issue.id} ("${issue.title}") has no acceptance criteria`,
          id: issue.id,
          filePath: issue.filePath,
          severity: 'warning',
        });
      }
    }

    return problems;
  }
}
