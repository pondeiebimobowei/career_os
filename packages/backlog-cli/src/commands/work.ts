import { CommandExecutor } from '../core/commandExecutor.js';
import { Result, ok } from '../core/result.js';
import { BacklogRepository } from '../domain/repository.js';
import { PlanningService } from '../application/planningService.js';
import { WorkRenderer } from '../infrastructure/renderers/workRenderer.js';
import { ResumeDetectionService } from '../application/resumeDetectionService.js';
import { GitAdapter } from '../infrastructure/git/adapter.js';
import { DependencyResolver } from '../parser/dependency-resolver.js';

export interface WorkCommandOptions {
  force?: boolean;
  cwd?: string;
}

export class WorkCommand extends CommandExecutor<void> {
  constructor(
    private options: WorkCommandOptions = {},
    private startDir: string = options.cwd || process.cwd()
  ) {
    super();
  }

  protected async run(): Promise<Result<void>> {
    const repository = new BacklogRepository(this.startDir);
    const backlogRes = await repository.load();
    if (!backlogRes.success) return backlogRes;

    const backlog = backlogRes.data;

    // Step 1: Resume Detection (unless --force is specified)
    if (!this.options.force) {
      const activeIssue = ResumeDetectionService.detectActiveIssue(this.startDir, backlog);
      if (activeIssue) {
        WorkRenderer.renderResume(activeIssue);
        return ok(undefined);
      }
    }

    // Step 2: Planning & Recommendation Engine
    const gitStatusRes = GitAdapter.getStatus(this.startDir);
    const branchName = gitStatusRes.success ? gitStatusRes.data.branch : '';
    let activeIssueId = ResumeDetectionService.parseBranchName(branchName);

    if (!activeIssueId) {
      const completedIssues = backlog.issues.filter(
        (i) => (i.status || '').toLowerCase() === 'done' || (i.lifecycle?.phase || '').toLowerCase() === 'done'
      );
      if (completedIssues.length > 0) {
        const lastCompleted = completedIssues[completedIssues.length - 1];
        if (lastCompleted) {
          activeIssueId = lastCompleted.id;
        }
      }
    }

    const activeCapability = activeIssueId ? DependencyResolver.extractCapability(activeIssueId) : undefined;

    const planRes = PlanningService.plan(backlog, {
      activeCapability,
      activeBranchContext: branchName,
    });
    if (!planRes.success) return planRes;

    const currentMilestone = planRes.data.nextIssue?.milestone || 'FOUNDATION';
    const progressRes = await repository.computeMilestoneProgress(currentMilestone);
    if (!progressRes.success) return progressRes;

    WorkRenderer.render(progressRes.data, planRes.data);
    return ok(undefined);
  }
}

export async function workCommand(options: WorkCommandOptions = {}) {
  const command = new WorkCommand(options, options.cwd);
  await command.execute(options.cwd);
}
