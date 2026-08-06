import pc from 'picocolors';
import { CommandExecutor } from '../core/commandExecutor.js';
import { Result, ok } from '../core/result.js';

export class VersionCommand extends CommandExecutor<void> {
  protected async run(): Promise<Result<void>> {
    console.log(pc.bold(pc.cyan('\nCareerOS Backlog CLI Framework\n')));
    console.log(`Backlog CLI Version: ${pc.bold('1.0.0')}`);
    console.log(`Backlog Schema:      ${pc.bold('1.0.0')}`);
    console.log(`Workspace Version:   ${pc.bold('1.0.0')}\n`);
    return ok(undefined);
  }
}

export async function versionCommand() {
  const command = new VersionCommand();
  await command.execute();
}
