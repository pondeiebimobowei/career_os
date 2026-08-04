import path from 'node:path';
import { BacklogModel, ValidationError } from '../parser/types.js';

export function validateIdUniqueness(model: BacklogModel): ValidationError[] {
  const errors: ValidationError[] = [];

  const issueLocations = new Map<string, string[]>();
  for (const issue of model.issues) {
    const file = issue.filePath ? path.basename(issue.filePath) : 'unknown file';
    const locs = issueLocations.get(issue.id) || [];
    locs.push(file);
    issueLocations.set(issue.id, locs);
  }

  for (const [id, locs] of issueLocations.entries()) {
    if (locs.length > 1) {
      errors.push({
        type: 'ID_DUPLICATE',
        code: 'DUPLICATE_ISSUE_ID',
        message: `Duplicate issue ID "${id}" found in: ${locs.join(', ')}`,
        id,
        severity: 'error',
      });
    }
  }

  const featureLocations = new Map<string, string[]>();
  for (const feature of model.features) {
    const file = feature.filePath ? path.basename(feature.filePath) : 'unknown file';
    const locs = featureLocations.get(feature.id) || [];
    locs.push(file);
    featureLocations.set(feature.id, locs);
  }

  for (const [id, locs] of featureLocations.entries()) {
    if (locs.length > 1) {
      errors.push({
        type: 'ID_DUPLICATE',
        code: 'DUPLICATE_FEATURE_ID',
        message: `Duplicate feature ID "${id}" found in: ${locs.join(', ')}`,
        id,
        severity: 'error',
      });
    }
  }

  return errors;
}
