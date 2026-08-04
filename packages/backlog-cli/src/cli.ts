import { Command } from 'commander';
import { validateCommand } from './commands/validate.js';
import { syncCommand } from './commands/sync.js';
import { statusCommand } from './commands/status.js';
import { generateCommand } from './commands/generate.js';
import { nextCommand } from './commands/next.js';
import { startCommand } from './commands/start.js';
import { prCommand } from './commands/pr.js';
import { releaseCommand } from './commands/release.js';
import { doctorCommand } from './commands/doctor.js';
import { graphCommand } from './commands/graph.js';
import { exportCommand } from './commands/export.js';

const program = new Command();

program
  .name('backlog')
  .description('CareerOS Development Platform CLI - Product operating system compiler')
  .version('0.2.0');

program
  .command('validate')
  .description('Validate YAML backlog schemas, ID uniqueness, dependencies, and milestones')
  .action(async () => {
    await validateCommand();
  });

program
  .command('sync')
  .description('Synchronize canonical backlog with GitHub issues, milestones, and labels')
  .option('--dry-run', 'Preview sync operations without mutating GitHub', false)
  .action(async (options) => {
    await syncCommand({ dryRun: options.dryRun });
  });

program
  .command('status')
  .description('Report backlog milestone progress, issue counts, and critical path')
  .action(async () => {
    await statusCommand();
  });

program
  .command('generate [type]')
  .description('Scaffold new backlog domain YAML templates')
  .option('--id <id>', 'Domain / Epic ID (e.g. AUTH)')
  .option('--title <title>', 'Domain title')
  .option('--milestone <milestone>', 'Assigned milestone')
  .option('--priority <priority>', 'Default priority (P0-P3)')
  .option('-o, --output <path>', 'Destination file path')
  .action(async (type, options) => {
    await generateCommand(type || 'feature', options);
  });

program
  .command('next')
  .description('Recommend next unblocked P0 task to work on')
  .action(async () => {
    await nextCommand();
  });

program
  .command('start <issueId>')
  .description('Start work on an issue (calculates branch name and git command)')
  .action(async (issueId) => {
    await startCommand(issueId);
  });

program
  .command('pr <issueId>')
  .description('Generate Pull Request title and body template for an issue')
  .action(async (issueId) => {
    await prCommand(issueId);
  });

program
  .command('release [milestone]')
  .description('Generate release notes for a milestone')
  .action(async (milestone) => {
    await releaseCommand(milestone || 'beta');
  });

program
  .command('doctor')
  .description('Run health diagnostics (missing AC, orphaned dependencies, circular dependencies)')
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

export function runCLI() {
  program.parse(process.argv);
}
