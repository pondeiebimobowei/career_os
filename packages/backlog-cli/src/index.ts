import { Command } from 'commander';
import { validateCommand } from './commands/validate.js';
import { syncCommand } from './commands/sync.js';
import { statusCommand } from './commands/status.js';
import { doctorCommand } from './commands/doctor.js';
import { graphCommand } from './commands/graph.js';
import { exportCommand } from './commands/export.js';

const program = new Command();

program
  .name('backlog')
  .description('CareerOS Backlog CLI - Planning as Code compiler & GitHub synchronization tool')
  .version('0.1.0');

program
  .command('validate')
  .description('Validate backlog YAML schema, ID uniqueness, dependencies, and milestones without modifying GitHub')
  .action(async () => {
    await validateCommand();
  });

program
  .command('sync')
  .description('Synchronize workspace labels, milestones, and issues with GitHub')
  .option('--dry-run', 'Preview changes without mutating GitHub', false)
  .action(async (options) => {
    await syncCommand({ dryRun: options.dryRun });
  });

program
  .command('status')
  .description('Show milestone progress breakdown, issue counts, and critical path')
  .action(async () => {
    await statusCommand();
  });

program
  .command('doctor')
  .description('Run health diagnostics (missing AC, orphaned dependencies, circular dependencies, invalid priorities)')
  .action(async () => {
    await doctorCommand();
  });

program
  .command('graph')
  .description('Visualize issue and domain dependency graph')
  .option('--mermaid', 'Output diagram as Mermaid flowchart syntax', false)
  .action(async (options) => {
    await graphCommand({ mermaid: options.mermaid });
  });

program
  .command('export')
  .description('Export backlog into JSON, CSV, Markdown, or PDF format')
  .option('-f, --format <format>', 'Export format (json, csv, markdown, pdf)', 'json')
  .option('-o, --output <path>', 'Output file destination path')
  .action(async (options) => {
    await exportCommand({ format: options.format, output: options.output });
  });

program.parse(process.argv);
