import { describe, it, expect } from 'vitest';
import { BacklogLoader } from '../parser/loader.js';
import { BacklogValidator } from '../parser/validator.js';

describe('BacklogValidator', () => {
  it('should validate current CareerOS backlog with no errors', async () => {
    const backlog = await BacklogLoader.loadBacklog();
    const summary = BacklogValidator.validate(backlog);
    expect(summary.isValid).toBe(true);
    expect(summary.errors.length).toBe(0);
  });

  it('should detect duplicate issue IDs', () => {
    const dummyBacklog: any = {
      workspace: { name: 'Test' },
      epics: [],
      features: [],
      issues: [
        { id: 'APP-001', title: 'Task 1', filePath: 'file1.yaml' },
        { id: 'APP-001', title: 'Task 2', filePath: 'file2.yaml' },
      ],
      issuesById: new Map(),
      featuresById: new Map(),
      epicsById: new Map(),
      domainFiles: [],
      parseErrors: [],
    };

    const summary = BacklogValidator.validate(dummyBacklog);
    expect(summary.isValid).toBe(false);
    expect(summary.errors.some((e) => e.code === 'DUPLICATE_ISSUE_ID')).toBe(true);
  });

  it('should detect missing dependencies', () => {
    const dummyBacklog: any = {
      workspace: { name: 'Test' },
      epics: [],
      features: [],
      issues: [
        { id: 'APP-001', title: 'Task 1', dependencies: ['NONEXISTENT-999'], filePath: 'file1.yaml' },
      ],
      issuesById: new Map([['APP-001', { id: 'APP-001', title: 'Task 1' }]]),
      featuresById: new Map(),
      epicsById: new Map(),
      domainFiles: [],
      parseErrors: [],
    };

    const summary = BacklogValidator.validate(dummyBacklog);
    expect(summary.isValid).toBe(false);
    expect(summary.errors.some((e) => e.code === 'MISSING_DEPENDENCY')).toBe(true);
  });
});
