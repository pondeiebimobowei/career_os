import { Backlog, Issue, Epic, Feature } from '../types/backlog.js';

export class BacklogResolver {
  static resolveDependencies(backlog: Backlog): Map<string, Issue[]> {
    const dependencyMap = new Map<string, Issue[]>();

    for (const issue of backlog.issues) {
      if (!issue.dependencies) continue;

      for (const depId of issue.dependencies) {
        const dependents = dependencyMap.get(depId) || [];
        dependents.push(issue);
        dependencyMap.set(depId, dependents);
      }
    }

    return dependencyMap;
  }

  static getBlockedIssues(backlog: Backlog): Array<{ issue: Issue; waitingFor: string[] }> {
    const blocked: Array<{ issue: Issue; waitingFor: string[] }> = [];

    for (const issue of backlog.issues) {
      if (issue.dependencies && issue.dependencies.length > 0) {
        blocked.push({
          issue,
          waitingFor: issue.dependencies,
        });
      }
    }

    return blocked;
  }
}
