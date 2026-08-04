import pc from 'picocolors';
import { parseBacklog } from '../parser/catalog.ts';
import { validateBacklog } from '../validator/index.ts';

export async function validateCommand(options: { cwd?: string } = {}) {
  const startDir = options.cwd || process.cwd();
  const model = parseBacklog(startDir);
  const validation = validateBacklog(model);

  console.log('\nChecking backlog integrity...\n');

  if (model.readme) {
    console.log(`${pc.green('✓')} README.yaml`);
  }
  if (model.workspace) {
    console.log(`${pc.green('✓')} Workspace: ${pc.bold(model.workspace.name)}`);
  }

  console.log(`${pc.green('✓')} ${model.domainFiles.length} domain files`);
  console.log(`${pc.green('✓')} ${model.epics.length} epics`);
  console.log(`${pc.green('✓')} ${model.features.length} features`);
  console.log(`${pc.green('✓')} ${model.issues.length} issues`);

  if (validation.isValid) {
    console.log(`${pc.green('✓')} IDs unique`);
    console.log(`${pc.green('✓')} Dependencies valid`);
    console.log(`${pc.green('✓')} Milestones valid`);
    console.log(`${pc.green('✓')} Schema valid`);
    console.log(pc.bold(pc.green('\nNo errors found.\n')));
    process.exit(0);
  } else {
    console.log(pc.bold(pc.red(`\nERROR (${validation.errors.length} errors found)\n`)));
    for (const err of validation.errors) {
      console.log(pc.bold(pc.red(`- [${err.code}] ${err.message}`)));
      if (err.filePath) console.log(pc.gray(`  File: ${err.filePath}`));
    }
    console.log('');
    process.exit(1);
  }
}
