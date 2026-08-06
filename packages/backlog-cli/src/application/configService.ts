import path from 'node:path';
import { Result, ok } from '../core/result.js';
import { GitAdapter } from '../infrastructure/git/adapter.js';

export interface WorkspaceContext {
  workspaceRoot: string;
  gitBranch: string;
  gitAuthor: string;
  backlogDir: string;
  docsDir: string;
}

export class ConfigurationService {
  static resolveContext(startDir: string = process.cwd()): Result<WorkspaceContext> {
    const statusRes = GitAdapter.getStatus(startDir);
    const gitBranch = statusRes.success ? statusRes.data.branch : 'main';
    const gitAuthor = statusRes.success ? statusRes.data.author : 'developer';

    const context: WorkspaceContext = {
      workspaceRoot: startDir,
      gitBranch,
      gitAuthor,
      backlogDir: path.join(startDir, 'docs', 'backlog'),
      docsDir: path.join(startDir, 'docs'),
    };

    return ok(context);
  }
}
