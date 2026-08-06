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
import { docsCommand } from './commands/docs.js';
import { finishCommand } from './commands/finish.js';
import { workCommand } from './commands/work.js';
import { explainCommand } from './commands/explain.js';
import { aiCommand } from './commands/ai.js';
import { dashboardCommand } from './commands/dashboard.js';
import { verifyCommand } from './commands/verify.js';
import { statsCommand } from './commands/stats.js';
import { versionCommand } from './commands/version.js';

const program = new Command();

program
  .name('backlog')
  .description('CareerOS Development Platform CLI - v1.0 Product operating system compiler')
  .version('1.0.0');

program
  .command('work')
  .description('Daily developer entry point (prints milestone, next unblocked task, branch & suggested actions)')
  .action(async () => {
    await workCommand();
  });

program
  .command('finish <issueId>')
  .description('Finish implementation of an issue locally (validates AC/git state, updates YAML & dispatches events)')
  .action(async (issueId) => {
    await finishCommand(issueId);
  });

program
  .command('explain <issueId>')
  .description('Human-optimized issue summary (objective, impact, ADR references, DoD)')
  .action(async (issueId) => {
    await explainCommand(issueId);
  });

program
  .command('ai <issueId>')
  .description('Generate rich AI implementation context bundle for coding assistants')
  .action(async (issueId) => {
    await aiCommand(issueId);
  });

program
  .command('dashboard')
  .description('Display terminal executive dashboard with velocity, milestone progress & critical path')
  .action(async () => {
    await dashboardCommand();
  });

program
  .command('verify')
  .description('Run comprehensive repository & backlog integrity gate for CI')
  .action(async () => {
    await verifyCommand();
  });

program
  .command('stats')
  .description('Report engineering telemetry, velocity, cycle time, and WIP metrics')
  .action(async () => {
    await statsCommand();
  });

program
  .command('version')
  .description('Display CLI framework version, schema version, and workspace version')
  .action(async () => {
    await versionCommand();
  });

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
  .description('Recommend next unblocked P0 task using planning scoring algorithm')
  .option('--json', 'Output recommendation as structured JSON for AI context injection', false)
  .action(async (options) => {
    await nextCommand({ json: options.json });
  });

program
  .command('start <issueId>')
  .description('Start work on an issue (calculates branch name and executes git checkout)')
  .option('--no-checkout', 'Do not execute git checkout automatically')
  .action(async (issueId, options) => {
    await startCommand(issueId, { checkout: options.checkout });
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
  .command('docs')
  .description('Generate synchronized Markdown documentation report from backlog')
  .option('-o, --output <path>', 'Output markdown file path')
  .action(async (options) => {
    await docsCommand({ output: options.output });
  });

program
  .command('doctor')
  .description('Run health diagnostics (missing AC, orphaned dependencies, circular dependencies, tooling)')
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
