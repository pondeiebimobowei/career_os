import { CommandExecutor } from '../core/commandExecutor.js';
import { Result, ok } from '../core/result.js';
import { BacklogRepository } from '../domain/repository.js';
import { MetricsCalculator } from '../application/metricsCalculator.js';
import { StatsRenderer } from '../infrastructure/renderers/statsRenderer.js';

export class StatsCommand extends CommandExecutor<void> {
  constructor(private startDir: string = process.cwd()) {
    super();
  }

  protected async run(): Promise<Result<void>> {
    const repository = new BacklogRepository(this.startDir);
    const backlogRes = await repository.load();
    if (!backlogRes.success) return backlogRes;

    const metricsRes = MetricsCalculator.calculate(backlogRes.data);
    if (!metricsRes.success) return metricsRes;

    StatsRenderer.render(metricsRes.data);
    return ok(undefined);
  }
}

export async function statsCommand(options: { cwd?: string } = {}) {
  const command = new StatsCommand(options.cwd);
  await command.execute(options.cwd);
}
