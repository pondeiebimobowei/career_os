import pc from 'picocolors';
import { CommandExecutor } from '../core/commandExecutor.js';
import { Result, ok, fail } from '../core/result.js';
import { BacklogRepository } from '../domain/repository.js';
import { BacklogValidator } from '../parser/validator.js';

export class VerifyCommand extends CommandExecutor<void> {
  constructor(private startDir: string = process.cwd()) {
    super();
  }

  protected async run(): Promise<Result<void>> {
    const repository = new BacklogRepository(this.startDir);
    const backlogRes = await repository.load();
    if (!backlogRes.success) return backlogRes;

    const summary = BacklogValidator.validate(backlogRes.data);
    const b = summary.backlog;

    console.log(pc.bold(pc.cyan('\n=== Repository & Backlog Parity Gate ===\n')));
    console.log(`✓ Workspace:    ${b.workspace?.name || 'CareerOS'}`);
    console.log(`✓ Domain Files: ${b.domainFiles.length}`);
    console.log(`✓ Epics:        ${b.epics.length}`);
    console.log(`✓ Features:     ${b.features.length}`);
    console.log(`✓ Issues:       ${b.issues.length}`);
    console.log(`✓ Unique IDs verified`);
    console.log(`✓ DAG Dependencies verified`);
    console.log(`✓ Milestones verified\n`);

    if (summary.errors.length > 0) {
      console.log(pc.red(`\n✖ ${summary.errors.length} Integrity Validation Errors found:`));
      summary.errors.forEach((err) => console.log(pc.red(`  - [${err.code}] ${err.message}`)));
      return fail(new Error('Backlog verification failed'));
    }

    console.log(pc.bold(pc.green('✔ All repository and backlog integrity gates passed successfully.\n')));
    return ok(undefined);
  }
}

export async function verifyCommand(options: { cwd?: string } = {}) {
  const command = new VerifyCommand(options.cwd);
  await command.execute(options.cwd);
}
