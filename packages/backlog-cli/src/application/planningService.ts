import { Result, ok, fail } from '../core/result.js';
import { Issue, Backlog } from '../types/backlog.js';
import { DependencyResolver } from '../parser/dependency-resolver.js';

export interface PlanningRecommendation {
  nextIssue: Issue | null;
  score: number;
  reason: string;
  criticalPath: Issue[];
  blockedIssues: Issue[];
  remainingCount: number;
}

export class PlanningService {
  static plan(backlog: Backlog): Result<PlanningRecommendation> {
    try {
      const scored = DependencyResolver.scoreIssues(backlog);
      const topScored = scored.find((s) => s.unblocked) || scored[0] || null;

      const nextIssue = topScored ? topScored.issue : null;
      const score = topScored ? topScored.score : 0;
      const reason = topScored ? topScored.reason : 'No open tasks';

      const remainingIssues = backlog.issues.filter((i) => (i.status || 'todo') !== 'done');
      const blockedIssues = scored.filter((s) => !s.unblocked).map((s) => s.issue);
      const criticalPath = scored.filter((s) => s.unblocked).slice(0, 5).map((s) => s.issue);

      return ok({
        nextIssue,
        score,
        reason,
        criticalPath,
        blockedIssues,
        remainingCount: remainingIssues.length,
      });
    } catch (err: any) {
      return fail(err);
    }
  }
}
