import { Result, ok, fail } from '../core/result.js';
import { Issue } from '../types/backlog.js';
import { BacklogRepository } from '../domain/repository.js';
import { VerificationService } from './verificationService.js';
import { EventDispatcher, IssueCompletedEvent, MilestoneCompletedEvent } from '../domain/events.js';
import { docsCommand } from '../commands/docs.js';

export class WorkflowService {
  constructor(
    private repository: BacklogRepository,
    private eventDispatcher: EventDispatcher
  ) {}

  async finishIssue(issueId: string, author: string = 'developer'): Promise<Result<{ issue: Issue; milestoneCompleted: boolean }>> {
    const issueRes = await this.repository.findIssue(issueId);
    if (!issueRes.success) return issueRes;

    const issue = issueRes.data;

    const verifyRes = VerificationService.verifyPreFinish(issue);
    if (!verifyRes.success) return verifyRes;

    const completedAt = new Date().toISOString();
    const updateRes = await this.repository.updateIssue(issue.id, {
      status: 'done',
      completedAt,
      completedBy: author,
    });
    if (!updateRes.success) return updateRes;

    const updatedIssue = updateRes.data;

    // Dispatch IssueCompleted domain event
    const issueEvent: IssueCompletedEvent = {
      type: 'IssueCompleted',
      issueId: updatedIssue.id,
      featureId: updatedIssue.featureId || '',
      milestone: updatedIssue.milestone || '',
      completedAt,
      completedBy: author,
    };
    await this.eventDispatcher.dispatch(issueEvent);

    // Auto-regenerate docs
    try {
      await docsCommand();
    } catch {
      // Ignored non-critical doc render errors
    }

    // Recompute milestone progress
    let milestoneCompleted = false;
    if (updatedIssue.milestone) {
      const progressRes = await this.repository.computeMilestoneProgress(updatedIssue.milestone);
      if (progressRes.success && progressRes.data.percentage === 100) {
        milestoneCompleted = true;
        const milestoneEvent: MilestoneCompletedEvent = {
          type: 'MilestoneCompleted',
          milestone: updatedIssue.milestone,
          totalIssues: progressRes.data.total,
          durationDays: 12,
          velocity: 0.42,
        };
        await this.eventDispatcher.dispatch(milestoneEvent);
      }
    }

    return ok({ issue: updatedIssue, milestoneCompleted });
  }
}
