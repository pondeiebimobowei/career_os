import { BacklogModel, ValidationError } from '../parser/types.js';

export function validateDependencies(model: BacklogModel): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const issue of model.issues) {
    if (!issue.dependencies || issue.dependencies.length === 0) continue;

    for (const depId of issue.dependencies) {
      if (!model.issuesById.has(depId) && !model.epicsById.has(depId) && !model.featuresById.has(depId)) {
        errors.push({
          type: 'DEPENDENCY_NOT_FOUND',
          code: 'MISSING_DEPENDENCY',
          message: `Issue ${issue.id} depends on "${depId}", which does not exist`,
          id: issue.id,
          filePath: issue.filePath,
          severity: 'error',
        });
      }
    }
  }

  // Detect circular dependencies among issues
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(currId: string, path: string[]): boolean {
    visited.add(currId);
    recursionStack.add(currId);
    path.push(currId);

    const issue = model.issuesById.get(currId);
    if (issue && issue.dependencies) {
      for (const depId of issue.dependencies) {
        if (!visited.has(depId)) {
          if (dfs(depId, path)) return true;
        } else if (recursionStack.has(depId)) {
          const cyclePath = [...path.slice(path.indexOf(depId)), depId].join(' -> ');
          errors.push({
            type: 'CIRCULAR_DEPENDENCY',
            code: 'CIRCULAR_DEPENDENCY',
            message: `Circular dependency detected: ${cyclePath}`,
            id: currId,
            filePath: issue.filePath,
            severity: 'error',
          });
          return true;
        }
      }
    }

    recursionStack.delete(currId);
    path.pop();
    return false;
  }

  for (const issue of model.issues) {
    if (!visited.has(issue.id)) {
      dfs(issue.id, []);
    }
  }

  return errors;
}
