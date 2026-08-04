import pc from 'picocolors';
import { BacklogService } from '../services/backlogService.js';
import { DependencyResolver } from '../parser/dependency-resolver.js';

export async function nextCommand(options: { cwd?: string } = {}) {
  const service = new BacklogService(options.cwd);
  const backlog = await service.load();
  const nextTask = DependencyResolver.getNextRecommendedTask(backlog);

  console.log(pc.bold(pc.cyan('\n=== Next Recommended Task ===\n')));

  if (!nextTask) {
    console.log(pc.green('No open tasks remaining in backlog!'));
    return;
  }

  console.log(`Issue ID:     ${pc.bold(pc.yellow(nextTask.id))}`);
  console.log(`Title:        ${pc.bold(nextTask.title)}`);
  console.log(`Priority:     ${pc.green(nextTask.priority || 'P1')}`);
  console.log(`Estimate:     ${pc.cyan(nextTask.estimate || 2)} pts`);
  console.log(`Milestone:    ${pc.magenta(nextTask.milestone || 'FOUNDATION')}`);
  console.log(`Reason:       Dependencies satisfied, top priority`);

  if (nextTask.acceptance_criteria && nextTask.acceptance_criteria.length > 0) {
    console.log(`\nAcceptance Criteria:`);
    for (const ac of nextTask.acceptance_criteria) {
      console.log(`  - [ ] ${ac}`);
    }
  }

  console.log(`\nTo start working on this task:`);
  console.log(pc.bold(pc.cyan(`  pnpm backlog start ${nextTask.id}\n`)));
}
