import { Backlog, ValidationProblem } from '../types/backlog.js';
import { Issue } from '../types/Issue.js';

export interface ScoredIssue {
  issue: Issue;
  score: number;
  unblocked: boolean;
  reason: string;
}

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

  static scoreIssues(backlog: Backlog): ScoredIssue[] {
    const results: ScoredIssue[] = [];

    const priorityWeights: Record<string, number> = { P0: 100, P1: 75, P2: 50, P3: 25 };
    const milestoneWeights: Record<string, number> = {
      FOUNDATION: 50,
      CORE_TRACKER: 40,
      PRODUCTIVITY: 30,
      CAPTURE: 20,
      MVP_POLISH: 10,
      BETA: 5,
    };

    // Filter out completed issues
    const openIssues = backlog.issues.filter((i) => i.status !== 'done');

    for (const issue of openIssues) {
      let score = 0;
      let unblocked = true;
      const reasons: string[] = [];

      // Check dependencies
      if (issue.dependencies && issue.dependencies.length > 0) {
        const unsatisfiedDeps = issue.dependencies.filter((depId) => {
          const depIssue = backlog.issuesById.get(depId);
          return !depIssue || depIssue.status !== 'done';
        });

        if (unsatisfiedDeps.length > 0) {
          unblocked = false;
          reasons.push(`Blocked by: ${unsatisfiedDeps.join(', ')}`);
        } else {
          score += 100;
          reasons.push('Dependencies satisfied');
        }
      } else {
        score += 150;
        reasons.push('Zero blockers');
      }

      // Priority
      const pWeight = priorityWeights[issue.priority || 'P1'] || 50;
      score += pWeight;
      reasons.push(`Priority ${issue.priority || 'P1'}`);

      // Milestone
      const mWeight = milestoneWeights[issue.milestone || 'FOUNDATION'] || 10;
      score += mWeight;

      // Estimate bonus for fast flow (1-2 pts)
      const estNum = typeof issue.estimate === 'number' ? issue.estimate : parseInt(String(issue.estimate), 10) || 2;
      if (estNum <= 2) score += 10;

      results.push({
        issue,
        score,
        unblocked,
        reason: reasons.join(', '),
      });
    }

    // Sort by unblocked first, then highest score
    return results.sort((a, b) => {
      if (a.unblocked !== b.unblocked) return a.unblocked ? -1 : 1;
      return b.score - a.score;
    });
  }

  static getNextRecommendedTask(backlog: Backlog): ScoredIssue | null {
    const scored = this.scoreIssues(backlog);
    return scored[0] || null;
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
