import pc from 'picocolors';
import { BacklogService } from '../services/backlogService.js';
import { logger } from '../utils/logger.js';

export async function validateCommand(options: { cwd?: string } = {}) {
  const service = new BacklogService(options.cwd);
  logger.info('\nChecking backlog integrity...\n');

  const validation = await service.validate();
  const backlog = validation.backlog;

  if (backlog.readme) {
    console.log(`${pc.green('✓')} README.yaml`);
  }
  if (backlog.workspace) {
    console.log(`${pc.green('✓')} Workspace: ${pc.bold(backlog.workspace.name)}`);
  }

  console.log(`${pc.green('✓')} ${backlog.domainFiles.length} domain files`);
  console.log(`${pc.green('✓')} ${backlog.epics.length} epics`);
  console.log(`${pc.green('✓')} ${backlog.features.length} features`);
  console.log(`${pc.green('✓')} ${backlog.issues.length} issues`);

  if (validation.isValid) {
    console.log(`${pc.green('✓')} IDs unique`);
    console.log(`${pc.green('✓')} Dependencies valid`);
    console.log(`${pc.green('✓')} Milestones valid`);
    console.log(`${pc.green('✓')} Schema valid`);
    logger.success('\nNo errors found.\n');
    process.exit(0);
  } else {
    logger.error(`\nERROR (${validation.errors.length} errors found)\n`);
    for (const err of validation.errors) {
      console.log(pc.bold(pc.red(`- [${err.code}] ${err.message}`)));
      if (err.filePath) console.log(pc.gray(`  File: ${err.filePath}`));
    }
    console.log('');
    process.exit(1);
  }
}
