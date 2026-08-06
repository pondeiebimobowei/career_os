import { describe, it, expect } from 'vitest';
import { WorkCommand } from '../../commands/work.js';
import { ExplainCommand } from '../../commands/explain.js';
import { AICommand } from '../../commands/ai.js';
import { DashboardCommand } from '../../commands/dashboard.js';
import { StatsCommand } from '../../commands/stats.js';
import { VerifyCommand } from '../../commands/verify.js';
import { DoctorCommand } from '../../commands/doctor.js';
import { VersionCommand } from '../../commands/version.js';
import { SetupCommand } from '../../commands/setup.js';
import { RepairCommand } from '../../commands/repair.js';

describe('CLI Integration Tests', () => {
  it('should execute WorkCommand successfully', async () => {
    const command = new WorkCommand();
    const res = await command.execute();
    expect(res.success).toBe(true);
  });

  it('should execute ExplainCommand successfully', async () => {
    const command = new ExplainCommand('FND-001');
    const res = await command.execute();
    expect(res.success).toBe(true);
  });

  it('should execute AICommand successfully', async () => {
    const command = new AICommand('FND-001');
    const res = await command.execute();
    expect(res.success).toBe(true);
  });

  it('should execute DashboardCommand successfully', async () => {
    const command = new DashboardCommand();
    const res = await command.execute();
    expect(res.success).toBe(true);
  });

  it('should execute StatsCommand successfully', async () => {
    const command = new StatsCommand();
    const res = await command.execute();
    expect(res.success).toBe(true);
  });

  it('should execute VerifyCommand successfully', async () => {
    const command = new VerifyCommand();
    const res = await command.execute();
    expect(res.success).toBe(true);
  });

  it('should execute VerifyCommand with --json option successfully', async () => {
    const command = new VerifyCommand({ json: true });
    const res = await command.execute();
    expect(res.success).toBe(true);
  });

  it('should execute DoctorCommand successfully', async () => {
    const command = new DoctorCommand();
    const res = await command.execute();
    expect(res.success).toBe(true);
  });

  it('should execute VersionCommand successfully', async () => {
    const command = new VersionCommand();
    const res = await command.execute();
    expect(res.success).toBe(true);
  });

  it('should execute SetupCommand successfully', async () => {
    const command = new SetupCommand();
    const res = await command.execute();
    expect(res.success).toBe(true);
  });

  it('should execute RepairCommand successfully', async () => {
    const command = new RepairCommand(process.cwd(), true);
    const res = await command.execute();
    expect(res.success).toBe(true);
  });
});
