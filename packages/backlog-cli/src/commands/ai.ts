import pc from 'picocolors';
import { CommandExecutor } from '../core/commandExecutor.js';
import { Result, ok } from '../core/result.js';
import { BacklogRepository } from '../domain/repository.js';
import { AIContextAssembler } from '../application/contextAssembler.js';

export class AICommand extends CommandExecutor<void> {
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

    const bundleRes = AIContextAssembler.assemble(issueRes.data, backlogRes.data);
    if (!bundleRes.success) return bundleRes;

    console.log(pc.bold(pc.cyan(`\n=== AI Context Bundle: [${issueRes.data.id}] ===\n`)));
    console.log(JSON.stringify(bundleRes.data, null, 2));
    console.log();

    return ok(undefined);
  }
}

export async function aiCommand(issueId: string, options: { cwd?: string } = {}) {
  const command = new AICommand(issueId, options.cwd);
  await command.execute(options.cwd);
}
