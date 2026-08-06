import { CommandExecutor } from '../core/commandExecutor.js';
import { Result, ok } from '../core/result.js';
import { BacklogRepository } from '../domain/repository.js';
import { HumanContextAssembler } from '../application/contextAssembler.js';
import { ExplainRenderer } from '../infrastructure/renderers/explainRenderer.js';

export class ExplainCommand extends CommandExecutor<void> {
  constructor(
    private issueId: string,
    private startDir: string = process.cwd()
  ) {
    super();
  }

  protected async run(): Promise<Result<void>> {
    const repository = new BacklogRepository(this.startDir);
    const issueRes = await repository.findIssue(this.issueId);
    if (!issueRes.success) return issueRes;

    const backlogRes = await repository.load();
    if (!backlogRes.success) return backlogRes;

    const bundleRes = HumanContextAssembler.assemble(issueRes.data, backlogRes.data);
    if (!bundleRes.success) return bundleRes;

    ExplainRenderer.render(bundleRes.data);
    return ok(undefined);
  }
}

export async function explainCommand(issueId: string, options: { cwd?: string } = {}) {
  const command = new ExplainCommand(issueId, options.cwd);
  await command.execute(options.cwd);
}
