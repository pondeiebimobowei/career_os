import { BacklogModel, ValidationError } from '../parser/types.js';
import { validateSchemas } from './schema.js';
import { validateIdUniqueness } from './ids.js';
import { validateDependencies } from './dependencies.js';
import { validateMilestones } from './milestones.js';

export interface ValidationSummary {
  model: BacklogModel;
  errors: ValidationError[];
  warnings: ValidationError[];
  isValid: boolean;
}

export function validateBacklog(model: BacklogModel): ValidationSummary {
  const allProblems: ValidationError[] = [
    ...model.parseErrors,
    ...validateSchemas(model),
    ...validateIdUniqueness(model),
    ...validateDependencies(model),
    ...validateMilestones(model),
  ];

  const errors = allProblems.filter((p) => p.severity === 'error');
  const warnings = allProblems.filter((p) => p.severity === 'warning');

  return {
    model,
    errors,
    warnings,
    isValid: errors.length === 0,
  };
}
