import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma, PrismaClient } from '@repo/database';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient = prisma;

  async onModuleInit() {
    // Connect to database on module initialization if DATABASE_URL is set
    if (process.env.DATABASE_URL) {
      await this.client.$connect();
    }
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
