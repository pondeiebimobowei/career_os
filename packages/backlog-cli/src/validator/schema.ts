import { z } from 'zod';
import { BacklogModel, ValidationError } from '../parser/types.js';

export const PrioritySchema = z.enum(['P0', 'P1', 'P2', 'P3']);
export const IssueTypeSchema = z.enum(['task', 'bug', 'research', 'spike', 'refactor', 'chore']);

export const IssueSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.string().optional(),
  priority: PrioritySchema.optional(),
  estimate: z.number().optional(),
  dependencies: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
  acceptance_criteria: z.array(z.string()).optional(),
  definition_of_done: z.array(z.string()).optional(),
});

export function validateSchemas(model: BacklogModel): ValidationError[] {
  const errors: ValidationError[] = [];
  const requireAc = model.workspace?.rules?.require_acceptance_criteria ?? true;

  for (const issue of model.issues) {
    if (!issue.id || typeof issue.id !== 'string') {
      errors.push({
        type: 'SCHEMA',
        code: 'INVALID_ISSUE_ID',
        message: `Issue has missing or non-string ID in ${issue.filePath}`,
        filePath: issue.filePath,
        severity: 'error',
      });
    }

    if (!issue.title || issue.title.trim().length === 0) {
      errors.push({
        type: 'SCHEMA',
        code: 'MISSING_ISSUE_TITLE',
        message: `Issue ${issue.id} has no title`,
        filePath: issue.filePath,
        id: issue.id,
        severity: 'error',
      });
    }

    if (issue.priority && !['P0', 'P1', 'P2', 'P3'].includes(issue.priority)) {
      errors.push({
        type: 'SCHEMA',
        code: 'INVALID_PRIORITY',
        message: `Issue ${issue.id} has invalid priority: ${issue.priority}`,
        filePath: issue.filePath,
        id: issue.id,
        severity: 'error',
      });
    }

    if (requireAc && (!issue.acceptance_criteria || issue.acceptance_criteria.length === 0)) {
      errors.push({
        type: 'HEALTH_WARNING',
        code: 'MISSING_ACCEPTANCE_CRITERIA',
        message: `Issue ${issue.id} ("${issue.title}") has no acceptance criteria`,
        filePath: issue.filePath,
        id: issue.id,
        severity: 'warning',
      });
    }
  }

  return errors;
}
