import path from 'node:path';
import pc from 'picocolors';
import { dumpYamlContent } from '../utils/yaml.js';
import { writeTextFile } from '../utils/fs.ts';
import { BacklogLoader } from '../parser/loader.js';
import { logger } from '../utils/logger.js';

export async function generateCommand(
  targetType: string = 'feature',
  options: {
    id?: string;
    title?: string;
    epic?: string;
    milestone?: string;
    priority?: string;
    output?: string;
    cwd?: string;
  } = {}
) {
  const startDir = options.cwd || process.cwd();
  const location = BacklogLoader.locateBacklogRoot(startDir);

  const domainId = options.id || 'NEW_DOMAIN';
  const domainTitle = options.title || 'New Backlog Domain';
  const milestone = options.milestone || 'FOUNDATION';
  const priority = options.priority || 'P1';

  const templateData = {
    epic: {
      id: domainId,
      title: domainTitle,
      type: 'product',
      milestone,
    },
    objective: `Define and implement features for ${domainTitle}.`,
    dependencies: [],
    features: [
      {
        id: `${domainId}-CORE`,
        title: `${domainTitle} Core Functionality`,
        priority,
        issues: [
          {
            id: `${domainId.slice(0, 4)}-001`,
            title: `Initial ${domainTitle} Setup`,
            type: 'task',
            priority: 'P0',
            estimate: 2,
            acceptance_criteria: [`${domainTitle} repository setup completed`],
          },
        ],
      },
    ],
  };

  const yamlString = dumpYamlContent(templateData);

  if (options.output) {
    const targetFile = path.resolve(options.output);
    writeTextFile(targetFile, yamlString);
    logger.success(`\n✓ Generated backlog template at: ${targetFile}\n`);
  } else if (location) {
    const slug = domainTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const targetFile = path.join(location.backlogDir, 'product', `99-${slug}.yaml`);
    writeTextFile(targetFile, yamlString);
    logger.success(`\n✓ Scaffolding complete! Generated backlog domain at:\n  ${targetFile}\n`);
  } else {
    console.log(pc.cyan('\n=== Generated Backlog Domain Template ===\n'));
    console.log(yamlString);
  }
}
