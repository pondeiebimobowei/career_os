import { BacklogModel, ValidationError } from '../parser/types.js';

export const KNOWN_MILESTONES = [
  'FOUNDATION',
  'CORE_TRACKER',
  'PRODUCTIVITY',
  'CAPTURE',
  'MVP_POLISH',
  'BETA',
  'POST_MVP',
  'V2',
];

export function validateMilestones(model: BacklogModel): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const epic of model.epics) {
    if (epic.milestone && !KNOWN_MILESTONES.includes(epic.milestone)) {
      errors.push({
        type: 'MILESTONE_INVALID',
        code: 'UNKNOWN_MILESTONE',
        message: `Epic ${epic.id} specifies unknown milestone "${epic.milestone}"`,
        id: epic.id,
        filePath: epic.filePath,
        severity: 'warning',
      });
    }
  }

  for (const issue of model.issues) {
    if (issue.milestone && !KNOWN_MILESTONES.includes(issue.milestone)) {
      errors.push({
        type: 'MILESTONE_INVALID',
        code: 'UNKNOWN_MILESTONE',
        message: `Issue ${issue.id} specifies unknown milestone "${issue.milestone}"`,
        id: issue.id,
        filePath: issue.filePath,
        severity: 'warning',
      });
    }
  }

  return errors;
}
