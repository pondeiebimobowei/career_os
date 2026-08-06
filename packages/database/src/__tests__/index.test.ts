import { describe, it, expect } from '@jest/globals';
import { prisma, createPrismaClient } from '..';

describe('@repo/database', () => {
  it('exports prisma singleton instance', () => {
    expect(prisma).toBeDefined();
  });

  it('can instantiate a new PrismaClient instance', () => {
    const client = createPrismaClient();
    expect(client).toBeDefined();
  });
});
