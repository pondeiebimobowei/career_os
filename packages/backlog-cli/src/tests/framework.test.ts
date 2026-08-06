import { describe, it, expect } from 'vitest';
import { BacklogRepository } from '../domain/repository.js';
import { EventDispatcher, IssueCompletedEvent } from '../domain/events.js';
import { PlanningService } from '../application/planningService.js';
import { MetricsCalculator } from '../application/metricsCalculator.js';
import { VerificationService } from '../application/verificationService.js';
import { HumanContextAssembler, AIContextAssembler } from '../application/contextAssembler.js';

describe('Backlog CLI Framework Services', () => {
  it('should load repository and find issue', async () => {
    const repo = new BacklogRepository();
    const issueRes = await repo.findIssue('FND-001');
    expect(issueRes.success).toBe(true);
    if (issueRes.success) {
      expect(issueRes.data.id).toBe('FND-001');
    }
  });

  it('should compute milestone progress', async () => {
    const repo = new BacklogRepository();
    const progressRes = await repo.computeMilestoneProgress('FOUNDATION');
    expect(progressRes.success).toBe(true);
    if (progressRes.success) {
      expect(progressRes.data.milestone).toBe('FOUNDATION');
      expect(progressRes.data.total).toBeGreaterThan(0);
    }
  });

  it('should dispatch domain events to subscribers', async () => {
    const dispatcher = new EventDispatcher();
    let eventHandled = false;

    dispatcher.subscribe('IssueCompleted', async (evt: IssueCompletedEvent) => {
      expect(evt.issueId).toBe('FND-001');
      eventHandled = true;
    });

    const event: IssueCompletedEvent = {
      type: 'IssueCompleted',
      issueId: 'FND-001',
      featureId: 'FND-FEAT-1',
      milestone: 'FOUNDATION',
      completedAt: new Date().toISOString(),
      completedBy: 'test-author',
    };

    await dispatcher.dispatch(event);
    expect(eventHandled).toBe(true);
  });

  it('should calculate metrics', async () => {
    const repo = new BacklogRepository();
    const backlogRes = await repo.load();
    expect(backlogRes.success).toBe(true);
    if (backlogRes.success) {
      const metricsRes = MetricsCalculator.calculate(backlogRes.data);
      expect(metricsRes.success).toBe(true);
      if (metricsRes.success) {
        expect(metricsRes.data.totalIssues).toBeGreaterThan(0);
      }
    }
  });

  it('should assemble human and AI context bundles', async () => {
    const repo = new BacklogRepository();
    const issueRes = await repo.findIssue('FND-001');
    const backlogRes = await repo.load();

    if (issueRes.success && backlogRes.success) {
      const humanRes = HumanContextAssembler.assemble(issueRes.data, backlogRes.data);
      expect(humanRes.success).toBe(true);

      const aiRes = AIContextAssembler.assemble(issueRes.data, backlogRes.data);
      expect(aiRes.success).toBe(true);
      if (aiRes.success) {
        expect(aiRes.data.codingStandards).toBeDefined();
      }
    }
  });
});
