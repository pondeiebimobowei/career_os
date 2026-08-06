import pc from 'picocolors';
import { CommandExecutor } from '../core/commandExecutor.js';
import { Result, ok } from '../core/result.js';
import { BacklogRepository } from '../domain/repository.js';
import { EventDispatcher, IssueCompletedEvent, MilestoneCompletedEvent } from '../domain/events.js';
import { WorkflowService } from '../application/workflowService.js';

export class FinishCommand extends CommandExecutor<{ issueId: string }> {
  constructor(
    private issueId: string,
    private startDir: string = process.cwd()
  ) {
    super();
  }

  protected async run(): Promise<Result<{ issueId: string }>> {
    const repository = new BacklogRepository(this.startDir);
    const eventDispatcher = new EventDispatcher();

    eventDispatcher.subscribe('IssueCompleted', async (event: IssueCompletedEvent) => {
      console.log(pc.green(`\n✓ Domain Event Dispatched: IssueCompleted [${event.issueId}]`));
    });

    eventDispatcher.subscribe('MilestoneCompleted', async (event: MilestoneCompletedEvent) => {
      console.log(pc.bold(pc.yellow(`\n🎉 Milestone ${event.milestone} completed!`)));
      console.log(`Duration: ${event.durationDays} days | Velocity: ${event.velocity} issues/day\n`);
    });

    const workflowService = new WorkflowService(repository, eventDispatcher);
    const result = await workflowService.finishIssue(this.issueId, this.context.gitAuthor);
    if (!result.success) return result;

    console.log(pc.bold(pc.green(`\n✓ Successfully finished issue [${result.data.issue.id}]`)));
    console.log(`Status:      ${pc.bold('done')}`);
    console.log(`Completed:   ${result.data.issue.completedAt}`);
    console.log(`CompletedBy: ${result.data.issue.completedBy}\n`);

    return ok({ issueId: result.data.issue.id });
  }
}

export async function finishCommand(issueId: string, options: { cwd?: string } = {}) {
  const command = new FinishCommand(issueId, options.cwd);
  await command.execute(options.cwd);
}
