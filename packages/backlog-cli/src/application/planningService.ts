import { Result, ok, fail } from '../core/result.js';
import { Issue, Backlog } from '../types/backlog.js';
import {
  DependencyResolver,
  PlanningContextOptions,
  RecommendationFactors,
} from '../parser/dependency-resolver.js';

export interface BottleneckItem {
  blocker: Issue;
  blockedIssues: Issue[];
}

export interface PlanningRecommendation {
  nextIssue: Issue | null;
  score: number;
  reason: string;
  factors: RecommendationFactors | null;
  confidencePercentage: number;
  criticalPath: Issue[];
  blockedIssues: Issue[];
  bottlenecks: BottleneckItem[];
  remainingCount: number;
}

export class PlanningService {
  static getImpactOrderedBottlenecks(backlog: Backlog): BottleneckItem[] {
    const completedIds = new Set<string>();
    for (const issue of backlog.issues) {
      if (
        (issue.status || '').toLowerCase() === 'done' ||
        (issue.lifecycle?.phase || '').toLowerCase() === 'done'
      ) {
        completedIds.add(issue.id);
      }
    }

    const openIssues = backlog.issues.filter((i) => !completedIds.has(i.id));

    // Map blockerId -> array of open downstream issues blocked by blockerId
    const map = new Map<string, Issue[]>();

    for (const issue of openIssues) {
      const openDeps = (issue.dependencies || []).filter((depId) => !completedIds.has(depId));
      for (const depId of openDeps) {
        const list = map.get(depId) || [];
        list.push(issue);
        map.set(depId, list);
      }
    }

    const result: BottleneckItem[] = [];

    for (const [blockerId, blockedList] of map.entries()) {
      const blocker = backlog.issuesById.get(blockerId);
      if (blocker && !completedIds.has(blocker.id) && blockedList.length > 0) {
        result.push({
          blocker,
          blockedIssues: blockedList,
        });
      }
    }

    // Sort bottlenecks by impact (number of blocked downstream issues descending)
    result.sort((a, b) => b.blockedIssues.length - a.blockedIssues.length);

    return result;
  }

  static plan(
    backlog: Backlog,
    contextOptions: PlanningContextOptions = {}
  ): Result<PlanningRecommendation> {
    try {
      const scored = DependencyResolver.scoreIssues(backlog, contextOptions);
      const topScored = scored.find((s) => s.unblocked) || scored[0] || null;

      const nextIssue = topScored ? topScored.issue : null;
      const score = topScored ? topScored.score : 0;
      const reason = topScored ? topScored.reason : 'No open tasks';
      const factors = topScored ? topScored.factors : null;
      const confidencePercentage = topScored ? topScored.factors.confidencePercentage : 100;

      const remainingIssues = backlog.issues.filter(
        (i) => (i.status || 'todo').toLowerCase() !== 'done'
      );
      const blockedIssues = scored.filter((s) => !s.unblocked).map((s) => s.issue);
      const criticalPath = scored.filter((s) => s.unblocked).slice(0, 5).map((s) => s.issue);
      const bottlenecks = this.getImpactOrderedBottlenecks(backlog);

      return ok({
        nextIssue,
        score,
        reason,
        factors,
        confidencePercentage,
        criticalPath,
        blockedIssues,
        bottlenecks,
        remainingCount: remainingIssues.length,
      });
    } catch (err: any) {
      return fail(err);
    }
  }
}
