import { describe, it, expect } from '@jest/globals';
import { prisma, createPrismaClient, ApplicationStatus } from '..';

describe('@repo/database', () => {
  it('exports prisma singleton instance', () => {
    expect(prisma).toBeDefined();
  });

  it('can instantiate a new PrismaClient instance', () => {
    const client = createPrismaClient();
    expect(client).toBeDefined();
  });

  it('exports ApplicationStatus enum with 10 canonical pipeline states', () => {
    expect(ApplicationStatus.SAVED).toBe('SAVED');
    expect(ApplicationStatus.READY_TO_APPLY).toBe('READY_TO_APPLY');
    expect(ApplicationStatus.APPLIED).toBe('APPLIED');
    expect(ApplicationStatus.FOLLOW_UP).toBe('FOLLOW_UP');
    expect(ApplicationStatus.RECRUITER_SCREEN).toBe('RECRUITER_SCREEN');
    expect(ApplicationStatus.TECHNICAL).toBe('TECHNICAL');
    expect(ApplicationStatus.FINAL).toBe('FINAL');
    expect(ApplicationStatus.OFFER).toBe('OFFER');
    expect(ApplicationStatus.REJECTED).toBe('REJECTED');
    expect(ApplicationStatus.WITHDRAWN).toBe('WITHDRAWN');
  });
});
