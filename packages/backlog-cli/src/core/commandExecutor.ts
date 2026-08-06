import pc from 'picocolors';
import { Result } from './result.js';
import { ConfigurationService, WorkspaceContext } from '../application/configService.js';

export abstract class CommandExecutor<T = void> {
  protected context!: WorkspaceContext;

  async execute(startDir: string = process.cwd()): Promise<Result<T>> {
    const configRes = ConfigurationService.resolveContext(startDir);
    if (!configRes.success) {
      console.error(pc.red(`\nFailed to resolve workspace context: ${configRes.error.message}\n`));
      return configRes;
    }
    this.context = configRes.data;

    try {
      const result = await this.run();
      if (!result.success) {
        console.error(pc.red(`\nExecution Error: ${result.error.message}\n`));
      }
      return result;
    } catch (err: any) {
      console.error(pc.red(`\nUnexpected Error: ${err.message}\n`));
      process.exit(1);
    }
  }

  protected abstract run(): Promise<Result<T>>;
}
