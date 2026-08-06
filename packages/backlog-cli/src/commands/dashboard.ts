import { CommandExecutor } from '../core/commandExecutor.js';
import { Result, ok } from '../core/result.js';
import { BacklogRepository } from '../domain/repository.js';
import { PlanningService } from '../application/planningService.js';
import { MetricsCalculator } from '../application/metricsCalculator.js';
import { DashboardRenderer } from '../infrastructure/renderers/dashboardRenderer.js';

export class DashboardCommand extends CommandExecutor<void> {
  constructor(private startDir: string = process.cwd()) {
    super();
  }

  protected async run(): Promise<Result<void>> {
    const repository = new BacklogRepository(this.startDir);
    const backlogRes = await repository.load();
    if (!backlogRes.success) return backlogRes;

    const planRes = PlanningService.plan(backlogRes.data);
    if (!planRes.success) return planRes;

    const metricsRes = MetricsCalculator.calculate(backlogRes.data);
    if (!metricsRes.success) return metricsRes;

    const currentMilestone = planRes.data.nextIssue?.milestone || 'FOUNDATION';
    const progressRes = await repository.computeMilestoneProgress(currentMilestone);
    if (!progressRes.success) return progressRes;

    DashboardRenderer.render(
      progressRes.data,
      metricsRes.data,
      planRes.data.nextIssue,
      planRes.data.criticalPath
    );
    return ok(undefined);
  }
}

export async function dashboardCommand(options: { cwd?: string } = {}) {
  const command = new DashboardCommand(options.cwd);
  await command.execute(options.cwd);
}
