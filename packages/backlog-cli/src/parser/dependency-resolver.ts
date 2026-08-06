import { Backlog, ValidationProblem } from '../types/backlog.js';
import { Issue } from '../types/Issue.js';
import { getRecommendationWeights, WorkspaceRecommendationConfig } from '../domain/weights.js';

export interface RecommendationExplanation {
  factor: 'priority' | 'milestone' | 'dependency' | 'capability' | 'context';
  score: number;
  message: string;
}

export interface RecommendationFactors {
  milestone: number;
  priority: number;
  dependency: number;
  capability: number;
  context: number;
  totalScore: number;
  confidencePercentage: number;
  margin: number;
  explanations: RecommendationExplanation[];
}

export interface ScoredIssue {
  issue: Issue;
  score: number;
  unblocked: boolean;
  reason: string;
  factors: RecommendationFactors;
  unlockedIssues: Issue[];
}

export interface PlanningContextOptions {
  activeCapability?: string;
  activeBranchContext?: string;
  config?: WorkspaceRecommendationConfig;
}

export class DependencyResolver {
  /**
   * Helper to derive capability dynamically from issue ID (e.g. PROFILE-003 -> PROFILE).
   */
  static extractCapability(issueId: string): string {
    if (!issueId) return 'GENERAL';
    const parts = issueId.split('-');
    return parts[0].toUpperCase();
  }

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

  /**
   * Collects all unique open (non-done) downstream issues reachable from a given candidate issue.
   * Avoids double counting transitive dependencies.
   */
  static getReachableOpenDownstreamIssues(candidateId: string, backlog: Backlog): Issue[] {
    const directDownstreamMap = this.resolveDependencies(backlog);
    const reachable = new Map<string, Issue>();
    const queue: string[] = [candidateId];
    const visited = new Set<string>([candidateId]);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const dependents = directDownstreamMap.get(currentId) || [];

      for (const dependent of dependents) {
        if (!visited.has(dependent.id)) {
          visited.add(dependent.id);
          const isDone = (dependent.status || '').toLowerCase() === 'done';
          if (!isDone) {
            reachable.set(dependent.id, dependent);
            queue.push(dependent.id);
          }
        }
      }
    }

    return Array.from(reachable.values());
  }

  static scoreIssues(
    backlog: Backlog,
    contextOptions: PlanningContextOptions = {}
  ): ScoredIssue[] {
    const weights = getRecommendationWeights(contextOptions.config);
    const completedIssueIds = new Set<string>();

    for (const issue of backlog.issues) {
      if (
        (issue.status || '').toLowerCase() === 'done' ||
        (issue.lifecycle?.phase || '').toLowerCase() === 'done'
      ) {
        completedIssueIds.add(issue.id);
      }
    }

    // Determine milestone ordering and active milestone
    const milestoneSet = new Set<string>();
    for (const issue of backlog.issues) {
      if (issue.milestone) milestoneSet.add(issue.milestone.toUpperCase());
    }
    const milestones = Array.from(milestoneSet);
    
    // Active milestone is the first milestone containing incomplete issues
    let activeMilestone = milestones[0] || 'FOUNDATION';
    for (const ms of milestones) {
      const hasIncomplete = backlog.issues.some(
        (i) => (i.milestone || '').toUpperCase() === ms && !completedIssueIds.has(i.id)
      );
      if (hasIncomplete) {
        activeMilestone = ms;
        break;
      }
    }

    // Map priority rank index (P0=0, P1=1, P2=2, P3=3)
    const priorityRanks: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };

    // Filter open issues
    const openIssues = backlog.issues.filter((i) => !completedIssueIds.has(i.id));

    const scoredList: {
      issue: Issue;
      unblocked: boolean;
      factors: Omit<RecommendationFactors, 'confidencePercentage' | 'margin'>;
      unlockedIssues: Issue[];
    }[] = [];

    for (const issue of openIssues) {
      const explanations: RecommendationExplanation[] = [];

      // Check blockers
      const unsatisfiedDeps = (issue.dependencies || []).filter(
        (depId) => !completedIssueIds.has(depId)
      );
      const unblocked = unsatisfiedDeps.length === 0 && (issue.status || '').toLowerCase() !== 'blocked';

      // 1. Priority factor
      const priorityStr = (issue.priority || 'P1').toUpperCase();
      const priorityScore = weights.priority[priorityStr] ?? 50;
      explanations.push({
        factor: 'priority',
        score: priorityScore,
        message: `Priority ${priorityStr}`,
      });

      // 2. Milestone factor
      const issueMs = (issue.milestone || 'FOUNDATION').toUpperCase();
      let milestoneScore = weights.milestone.FUTURE ?? 10;
      if (issueMs === activeMilestone) {
        milestoneScore = weights.milestone.CURRENT ?? 80;
        explanations.push({
          factor: 'milestone',
          score: milestoneScore,
          message: `Current milestone (${issueMs})`,
        });
      } else {
        const activeIdx = milestones.indexOf(activeMilestone);
        const issueIdx = milestones.indexOf(issueMs);
        if (issueIdx === activeIdx + 1) {
          milestoneScore = weights.milestone.NEXT ?? 40;
          explanations.push({
            factor: 'milestone',
            score: milestoneScore,
            message: `Next milestone (${issueMs})`,
          });
        }
      }

      // 3. Graph-Impact Dependency Leverage
      const unlockedIssues = unblocked ? this.getReachableOpenDownstreamIssues(issue.id, backlog) : [];
      let dependencyScore = 0;
      if (unblocked) {
        if (unlockedIssues.length > 0) {
          const unlockedPrioritySum = unlockedIssues.reduce((sum, d) => {
            const p = (d.priority || 'P1').toUpperCase();
            return sum + (weights.priority[p] ?? 50);
          }, 0);

          dependencyScore = Math.round(unlockedPrioritySum * weights.dependencyLeverageMultiplier);
          const unlockedNames = unlockedIssues.map((i) => i.id).join(', ');
          explanations.push({
            factor: 'dependency',
            score: dependencyScore,
            message:
              unlockedIssues.length === 1
                ? `Unblocks ${unlockedNames}`
                : `Unblocks ${unlockedIssues.length} issues (${unlockedNames})`,
          });
        } else if (!issue.dependencies || issue.dependencies.length === 0) {
          explanations.push({
            factor: 'dependency',
            score: 0,
            message: 'Zero blockers',
          });
        }
      }

      // 4. Conditional Capability Weight
      let capabilityScore = 0;
      const capabilityName = this.extractCapability(issue.id);
      if (contextOptions.activeCapability) {
        const activeCap = contextOptions.activeCapability.toUpperCase();
        if (capabilityName === activeCap) {
          // Conditional check: same capability AND priority diff <= 1 AND same milestone
          const issueP = priorityRanks[priorityStr] ?? 2;
          const activeP = priorityRanks['P0']; // Compare against top priority tier
          const prioDiff = Math.abs(issueP - activeP);
          const sameMs = issueMs === activeMilestone;

          if (prioDiff <= 1 && sameMs) {
            capabilityScore = weights.capability;
            explanations.push({
              factor: 'capability',
              score: capabilityScore,
              message: `Continues current ${capabilityName} capability`,
            });
          }
        }
      }

      // 5. Context Weight
      let contextScore = 0;
      if (
        contextOptions.activeBranchContext &&
        contextOptions.activeBranchContext.toUpperCase().includes(capabilityName)
      ) {
        contextScore = weights.context;
        explanations.push({
          factor: 'context',
          score: contextScore,
          message: 'Avoids context switching',
        });
      }

      const totalScore = priorityScore + milestoneScore + dependencyScore + capabilityScore + contextScore;

      scoredList.push({
        issue,
        unblocked,
        factors: {
          milestone: milestoneScore,
          priority: priorityScore,
          dependency: dependencyScore,
          capability: capabilityScore,
          context: contextScore,
          totalScore,
          explanations,
        },
        unlockedIssues,
      });
    }

    // Sort by unblocked first, then total score descending, then issue.id ascending for deterministic tie-breaking
    scoredList.sort((a, b) => {
      if (a.unblocked !== b.unblocked) return a.unblocked ? -1 : 1;
      if (b.factors.totalScore !== a.factors.totalScore) {
        return b.factors.totalScore - a.factors.totalScore;
      }
      return a.issue.id.localeCompare(b.issue.id);
    });

    // Calculate margin-based confidence percentage and raw score margin
    const unblockedCandidates = scoredList.filter((s) => s.unblocked);
    const topScore = unblockedCandidates[0]?.factors.totalScore || 0;
    const runnerUpScore = unblockedCandidates[1]?.factors.totalScore || 0;
    const rawMargin = unblockedCandidates.length > 1 ? topScore - runnerUpScore : topScore;

    let confidencePercentage = 100;
    if (unblockedCandidates.length > 1 && topScore > 0) {
      const relMargin = (topScore - runnerUpScore) / topScore;
      confidencePercentage = Math.min(100, Math.max(50, Math.round(50 + relMargin * 50)));
    }

    return scoredList.map((item) => {
      const factors: RecommendationFactors = {
        ...item.factors,
        confidencePercentage: item.issue.id === unblockedCandidates[0]?.issue.id ? confidencePercentage : 50,
        margin: item.issue.id === unblockedCandidates[0]?.issue.id ? rawMargin : 0,
      };

      const reasonStr = item.factors.explanations.map((e) => e.message).join(', ');

      return {
        issue: item.issue,
        score: item.factors.totalScore,
        unblocked: item.unblocked,
        reason: reasonStr,
        factors,
        unlockedIssues: item.unlockedIssues,
      };
    });
  }

  static getNextRecommendedTask(
    backlog: Backlog,
    contextOptions: PlanningContextOptions = {}
  ): ScoredIssue | null {
    const scored = this.scoreIssues(backlog, contextOptions);
    return scored.find((s) => s.unblocked) || scored[0] || null;
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
