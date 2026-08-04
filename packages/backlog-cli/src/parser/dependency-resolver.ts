import { Backlog, ValidationProblem } from '../types/backlog.js';
import { Issue } from '../types/Issue.js';

export class DependencyResolver {
  static resolveDependencies(backlog: Backlog): Map<string, Issue[]> {
    const map = new Map<string, Issue[]>();
    for (const issue of backlog.issues) {
      if (!issue.dependencies) continue;
      for (const depId of issue.dependencies) {
        const list = map.get(depId) || [];
        list.push(issue);
        map.set(depId, list);
      }
    }
    return map;
  }

  static getNextRecommendedTask(backlog: Backlog): Issue | null {
    const candidate = backlog.issues.find(
      (i) => i.priority === 'P0' && (!i.dependencies || i.dependencies.length === 0)
    );
    return candidate || backlog.issues[0] || null;
  }

  static validateDependencyGraph(backlog: Backlog): ValidationProblem[] {
    const problems: ValidationProblem[] = [];

    for (const issue of backlog.issues) {
      if (!issue.dependencies || issue.dependencies.length === 0) continue;

      for (const depId of issue.dependencies) {
        if (!backlog.issuesById.has(depId) && !backlog.epicsById.has(depId) && !backlog.featuresById.has(depId)) {
          problems.push({
            type: 'DEPENDENCY_NOT_FOUND',
            code: 'MISSING_DEPENDENCY',
            message: `Issue ${issue.id} depends on non-existent target "${depId}"`,
            id: issue.id,
            filePath: issue.filePath,
            severity: 'error',
          });
        }
      }
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (currId: string, trace: string[]): boolean => {
      visited.add(currId);
      recStack.add(currId);
      trace.push(currId);

      const issue = backlog.issuesById.get(currId);
      if (issue && issue.dependencies) {
        for (const depId of issue.dependencies) {
          if (!visited.has(depId)) {
            if (dfs(depId, trace)) return true;
          } else if (recStack.has(depId)) {
            const cycleStr = [...trace.slice(trace.indexOf(depId)), depId].join(' -> ');
            problems.push({
              type: 'CIRCULAR_DEPENDENCY',
              code: 'CIRCULAR_DEPENDENCY',
              message: `Circular dependency detected: ${cycleStr}`,
              id: currId,
              filePath: issue.filePath,
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
}
