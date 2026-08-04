import pc from 'picocolors';
import { BacklogService } from '../services/backlogService.js';
import { DependencyResolver } from '../parser/dependency-resolver.js';

export async function nextCommand(options: { json?: boolean; cwd?: string } = {}) {
  const service = new BacklogService(options.cwd);
  const backlog = await service.load();
  const recommendation = DependencyResolver.getNextRecommendedTask(backlog);

  if (options.json) {
    if (!recommendation) {
      console.log(JSON.stringify({ recommendation: null }, null, 2));
      return;
    }
    const { issue, score, reason } = recommendation;
    console.log(
      JSON.stringify(
        {
          issue: issue.id,
          title: issue.title,
          priority: issue.priority,
          estimate: issue.estimate,
          milestone: issue.milestone,
          score,
          reason,
          acceptanceCriteria: issue.acceptance_criteria || [],
          dependencies: issue.dependencies || [],
          filePath: issue.filePath,
        },
        null,
        2
      )
    );
    return;
  }

  console.log(pc.bold(pc.cyan('\n=== Intelligent Task Recommendation ===\n')));

  if (!recommendation) {
    console.log(pc.green('No open tasks remaining in backlog!'));
    return;
  }

  const { issue, score, reason } = recommendation;

  console.log(`Issue ID:     ${pc.bold(pc.yellow(issue.id))}`);
  console.log(`Title:        ${pc.bold(issue.title)}`);
  console.log(`Priority:     ${pc.green(issue.priority || 'P1')}`);
  console.log(`Estimate:     ${pc.cyan(issue.estimate || 2)} pts`);
  console.log(`Milestone:    ${pc.magenta(issue.milestone || 'FOUNDATION')}`);
  console.log(`Score:        ${pc.bold(score)}`);
  console.log(`Reason:       ${reason}`);

  if (issue.acceptance_criteria && issue.acceptance_criteria.length > 0) {
    console.log(`\nAcceptance Criteria:`);
    for (const ac of issue.acceptance_criteria) {
      console.log(`  - [ ] ${ac}`);
    }
  }

  console.log(`\nTo start working on this task:`);
  console.log(pc.bold(pc.cyan(`  pnpm backlog start ${issue.id}\n`)));
}
