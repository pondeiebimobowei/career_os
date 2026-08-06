import { CommandExecutor } from '../core/commandExecutor.js';
import { Result, ok } from '../core/result.js';
import { BacklogRepository } from '../domain/repository.js';
import { PlanningService } from '../application/planningService.js';
import { WorkRenderer } from '../infrastructure/renderers/workRenderer.js';

export class WorkCommand extends CommandExecutor<void> {
  constructor(private startDir: string = process.cwd()) {
    super();
  }

  protected async run(): Promise<Result<void>> {
    const repository = new BacklogRepository(this.startDir);
    const backlogRes = await repository.load();
    if (!backlogRes.success) return backlogRes;

    const planRes = PlanningService.plan(backlogRes.data);
    if (!planRes.success) return planRes;

    const currentMilestone = planRes.data.nextIssue?.milestone || 'FOUNDATION';
    const progressRes = await repository.computeMilestoneProgress(currentMilestone);
    if (!progressRes.success) return progressRes;

    WorkRenderer.render(progressRes.data, planRes.data.nextIssue);
    return ok(undefined);
  }
}

export async function workCommand(options: { cwd?: string } = {}) {
  const command = new WorkCommand(options.cwd);
  await command.execute(options.cwd);
}
