import { describe, it, expect } from 'vitest';
import { Backlog, Issue } from '../types/backlog.js';
import { DependencyResolver } from '../parser/dependency-resolver.js';
import { PlanningService } from '../application/planningService.js';
import { ResumeDetectionService } from '../application/resumeDetectionService.js';

function createMockBacklog(issues: Partial<Issue>[]): Backlog {
  const fullIssues: Issue[] = issues.map((i, idx) => ({
    id: i.id || `TASK-${idx + 1}`,
    title: i.title || `Task ${idx + 1}`,
    type: i.type || 'task',
    priority: i.priority || 'P1',
    status: i.status || 'todo',
    milestone: i.milestone || 'FOUNDATION',
    dependencies: i.dependencies || [],
    estimate: i.estimate || 2,
    filePath: '/tmp/test.yaml',
  }));

  const issuesById = new Map<string, Issue>();
  for (const issue of fullIssues) {
    issuesById.set(issue.id.toUpperCase(), issue);
  }

  return {
    workspace: { name: 'TestWorkspace' } as any,
    readme: {} as any,
    epics: [],
    features: [],
    issues: fullIssues,
    issuesById,
    epicsById: new Map(),
    featuresById: new Map(),
    domainFiles: [],
    parseErrors: [],
  };
}

describe('Recommendation Engine & Invariants', () => {
  it('parses branch names correctly in ResumeDetectionService', () => {
    expect(ResumeDetectionService.parseBranchName('feature/profile-003-build-ui')).toBe('PROFILE-003');
    expect(ResumeDetectionService.parseBranchName('dash-001-shell')).toBe('DASH-001');
    expect(ResumeDetectionService.parseBranchName('main')).toBeNull();
  });

  it('INVARIANT: P0 beats P1 in same context', () => {
    const backlog = createMockBacklog([
      { id: 'TASK-001', priority: 'P1', milestone: 'FOUNDATION' },
      { id: 'TASK-002', priority: 'P0', milestone: 'FOUNDATION' },
    ]);

    const recommendation = DependencyResolver.getNextRecommendedTask(backlog);
    expect(recommendation?.issue.id).toBe('TASK-002');
  });

  it('INVARIANT: Blocked tasks never rank above ready tasks', () => {
    const backlog = createMockBacklog([
      { id: 'TASK-001', priority: 'P0', dependencies: ['TASK-099'], status: 'todo' }, // Blocked by non-done task
      { id: 'TASK-002', priority: 'P2', status: 'todo' }, // Unblocked
      { id: 'TASK-099', priority: 'P1', status: 'todo' },
    ]);

    const scored = DependencyResolver.scoreIssues(backlog);
    const firstUnblockedIndex = scored.findIndex((s) => s.unblocked);
    const firstBlockedIndex = scored.findIndex((s) => !s.unblocked);

    expect(firstUnblockedIndex).toBeLessThan(firstBlockedIndex);
    expect(scored[0].issue.id).not.toBe('TASK-001');
  });

  it('INVARIANT: Downstream leverage avoids double counting transitive dependencies', () => {
    // Graph: A -> B -> C (A blocks B, B blocks C)
    const backlog = createMockBacklog([
      { id: 'TASK-A', priority: 'P1', status: 'todo' },
      { id: 'TASK-B', priority: 'P1', dependencies: ['TASK-A'], status: 'todo' },
      { id: 'TASK-C', priority: 'P1', dependencies: ['TASK-B'], status: 'todo' },
    ]);

    const reachableFromA = DependencyResolver.getReachableOpenDownstreamIssues('TASK-A', backlog);
    // Unique reachable downstream open nodes from TASK-A are TASK-B and TASK-C (count = 2)
    expect(reachableFromA.map((i) => i.id)).toEqual(['TASK-B', 'TASK-C']);
  });

  it('INVARIANT: Equal scores resolve deterministically by issue ID', () => {
    const backlog1 = createMockBacklog([
      { id: 'TASK-B', priority: 'P1', milestone: 'FOUNDATION' },
      { id: 'TASK-A', priority: 'P1', milestone: 'FOUNDATION' },
    ]);

    const backlog2 = createMockBacklog([
      { id: 'TASK-A', priority: 'P1', milestone: 'FOUNDATION' },
      { id: 'TASK-B', priority: 'P1', milestone: 'FOUNDATION' },
    ]);

    const rec1 = DependencyResolver.getNextRecommendedTask(backlog1);
    const rec2 = DependencyResolver.getNextRecommendedTask(backlog2);

    expect(rec1?.issue.id).toBe('TASK-A');
    expect(rec2?.issue.id).toBe('TASK-A');
  });

  it('sorts bottlenecks by downstream impact', () => {
    // TASK-001 blocks 2 tasks (TASK-002, TASK-003)
    // TASK-004 blocks 1 task (TASK-005)
    const backlog = createMockBacklog([
      { id: 'TASK-001', status: 'todo' },
      { id: 'TASK-002', dependencies: ['TASK-001'], status: 'todo' },
      { id: 'TASK-003', dependencies: ['TASK-001'], status: 'todo' },
      { id: 'TASK-004', status: 'todo' },
      { id: 'TASK-005', dependencies: ['TASK-004'], status: 'todo' },
    ]);

    const bottlenecks = PlanningService.getImpactOrderedBottlenecks(backlog);
    expect(bottlenecks.length).toBe(2);
    expect(bottlenecks[0].blocker.id).toBe('TASK-001');
    expect(bottlenecks[0].blockedIssues.length).toBe(2);
    expect(bottlenecks[1].blocker.id).toBe('TASK-004');
    expect(bottlenecks[1].blockedIssues.length).toBe(1);
  });

  it('returns structured RecommendationExplanation factors and margin confidence score', () => {
    const backlog = createMockBacklog([
      { id: 'TASK-001', priority: 'P0', milestone: 'FOUNDATION' },
      { id: 'TASK-002', priority: 'P3', milestone: 'FOUNDATION' },
    ]);

    const res = PlanningService.plan(backlog);
    expect(res.success).toBe(true);
    if (!res.success) return;

    expect(res.data.nextIssue?.id).toBe('TASK-001');
    expect(res.data.factors).not.toBeNull();
    expect(res.data.confidencePercentage).toBeGreaterThanOrEqual(70);
    expect(res.data.factors?.explanations.length).toBeGreaterThan(0);
  });

  describe('Scenario-Based Golden Tests', () => {
    it('Golden Scenario 1: Active branch resume detection', () => {
      const backlog = createMockBacklog([
        { id: 'PROFILE-003', title: 'Build profile onboarding UI', priority: 'P0', status: 'in_progress' },
        { id: 'PROFILE-004', priority: 'P0', dependencies: ['PROFILE-003'], status: 'todo' },
        { id: 'DASH-001', priority: 'P0', status: 'todo' },
      ]);

      const activeIssueId = ResumeDetectionService.parseBranchName('feature/profile-003-build-profile-onboarding-ui');
      expect(activeIssueId).toBe('PROFILE-003');

      const activeIssue = backlog.issuesById.get(activeIssueId!);
      expect(activeIssue).toBeDefined();
      expect(activeIssue?.status).toBe('in_progress');
    });

    it('Golden Scenario 2: PROFILE-008 wins over DASH-001 when continuing capability and unlocking downstream tasks', () => {
      const backlog = createMockBacklog([
        { id: 'PROFILE-003', status: 'done', milestone: 'CORE_TRACKER' },
        { id: 'PROFILE-008', priority: 'P0', milestone: 'CORE_TRACKER', status: 'todo' },
        { id: 'PROFILE-009', priority: 'P0', milestone: 'CORE_TRACKER', dependencies: ['PROFILE-008'], status: 'todo' },
        { id: 'PROFILE-010', priority: 'P1', milestone: 'CORE_TRACKER', dependencies: ['PROFILE-008'], status: 'todo' },
        { id: 'DASH-001', priority: 'P0', milestone: 'CORE_TRACKER', status: 'todo' },
      ]);

      const planRes = PlanningService.plan(backlog, {
        activeCapability: 'PROFILE',
        activeBranchContext: 'feature/profile-008-user-settings',
      });

      expect(planRes.success).toBe(true);
      if (!planRes.success) return;

      expect(planRes.data.nextIssue?.id).toBe('PROFILE-008');
      expect(planRes.data.factors?.dependency).toBeGreaterThan(0);
      expect(planRes.data.factors?.capability).toBeGreaterThan(0);
    });
  });
});
