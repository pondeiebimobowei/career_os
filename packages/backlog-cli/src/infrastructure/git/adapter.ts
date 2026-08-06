import { execSync } from 'node:child_process';
import { Result, ok, fail } from '../../core/result.js';
import { InfrastructureError } from '../../core/errors.js';

export interface GitStatus {
  branch: string;
  isClean: boolean;
  author: string;
}

export class GitAdapter {
  static getStatus(cwd: string = process.cwd()): Result<GitStatus> {
    try {
      const branch = execSync('git branch --show-current', { cwd, encoding: 'utf-8' }).trim();
      const statusOutput = execSync('git status --porcelain', { cwd, encoding: 'utf-8' }).trim();
      const author = execSync('git config user.name', { cwd, encoding: 'utf-8' }).trim() || 'developer';

      return ok({
        branch,
        isClean: statusOutput.length === 0,
        author,
      });
    } catch (err: any) {
      return fail(new InfrastructureError(`Git command failed: ${err.message}`));
    }
  }

  static checkoutBranch(branchName: string, cwd: string = process.cwd()): Result<void> {
    try {
      execSync(`git checkout -b ${branchName}`, { cwd, stdio: 'inherit' });
      return ok(undefined);
    } catch (err: any) {
      return fail(new InfrastructureError(`Failed to checkout branch ${branchName}: ${err.message}`));
    }
  }
}
