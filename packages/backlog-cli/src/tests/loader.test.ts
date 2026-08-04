import { describe, it, expect } from 'vitest';
import { BacklogLoader } from '../parser/loader.js';

describe('BacklogLoader', () => {
  it('should locate and load the CareerOS backlog', async () => {
    const backlog = await BacklogLoader.loadBacklog();
    expect(backlog.workspace).toBeDefined();
    expect(backlog.workspace.name).toBe('CareerOS');
    expect(backlog.domainFiles.length).toBeGreaterThan(0);
    expect(backlog.issues.length).toBeGreaterThan(0);
  });

  it('should create an indexed map of issues by ID', async () => {
    const backlog = await BacklogLoader.loadBacklog();
    expect(backlog.issuesById.has('FND-001')).toBe(true);
    const fnd001 = backlog.issuesById.get('FND-001');
    expect(fnd001?.title).toBe('Initialize monorepo');
  });
});
