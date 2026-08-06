import { Result, ok, fail } from '../../core/result.js';
import { SyncPort } from '../../domain/ports.js';
import { Issue, Milestone } from '../../types/backlog.js';
import { syncCommand } from '../../commands/sync.js';

export class GitHubAdapter implements SyncPort {
  async syncIssues(issues: Issue[], milestones: Milestone[]): Promise<Result<{ synced: number }>> {
    try {
      await syncCommand({ dryRun: false });
      return ok({ synced: issues.length });
    } catch (err: any) {
      return fail(err);
    }
  }
}
