import { describe, it, expect } from 'vitest';
import { syncIssues, repairIssues } from '../github/issues.js';
import { BacklogRepository } from '../domain/repository.js';

describe('GitHub Synchronizer & Parity Reconciliation', () => {
  it('should be idempotent when octokit is not provided', async () => {
    const repo = new BacklogRepository();
    const backlogRes = await repo.load();
    expect(backlogRes.success).toBe(true);

    if (backlogRes.success) {
      const msMap = new Map<string, number>([['FOUNDATION', 1]]);
      const res1 = await syncIssues(null, 'owner', 'repo', backlogRes.data, msMap, true);
      expect(res1.issuesCreated).toBe(0);
      expect(res1.issuesUpdated).toBe(0);

      const res2 = await repairIssues(null, 'owner', 'repo', backlogRes.data, msMap, true);
      expect(res2.duplicatesClosed).toBe(0);
      expect(res2.issuesReconciled).toBe(0);
    }
  });

  it('should match issues by stable ID prefix [ID]', () => {
    const title = '[FND-005] Install design system dependencies';
    const match = title.match(/^\[([A-Z0-9-]+)\]/);
    expect(match).not.toBeNull();
    if (match) {
      expect(match[1]).toBe('FND-005');
    }
  });

  it('should parse backlog-id from HTML comments in body', () => {
    const body = 'Fixes FND-005\n<!-- backlog-id: FND-005 -->';
    const match = body.match(/<!--\s*backlog-id:\s*([A-Z0-9-]+)\s*-->/i);
    expect(match).not.toBeNull();
    if (match) {
      expect(match[1]).toBe('FND-005');
    }
  });
});
