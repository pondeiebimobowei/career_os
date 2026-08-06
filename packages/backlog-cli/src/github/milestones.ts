import { Octokit } from '@octokit/rest';
import { Backlog } from '../types/backlog.js';
import { StandardMilestones } from '../schema/enums.js';

export async function syncMilestones(
  octokit: Octokit | null,
  owner: string,
  repo: string,
  backlog: Backlog,
  dryRun: boolean
): Promise<{ milestonesCreated: number; milestoneMap: Map<string, number> }> {
  const desired = new Set<string>(Object.values(StandardMilestones));

  for (const epic of backlog.epics) {
    if (epic.milestone) desired.add(epic.milestone);
  }
  for (const issue of backlog.issues) {
    if (issue.milestone) desired.add(issue.milestone);
  }

  const milestoneMap = new Map<string, number>();

  if (!octokit) {
    return { milestonesCreated: 0, milestoneMap };
  }
  if (dryRun) {
    let dummy = 1;
    for (const m of desired) milestoneMap.set(m, dummy++);
    return { milestonesCreated: desired.size, milestoneMap };
  }

  let createdCount = 0;
  try {
    const res = await octokit.issues.listMilestones({ owner, repo, state: 'all' });
    for (const ms of res.data) {
      milestoneMap.set(ms.title, ms.number);
    }
  } catch {
    // API error
  }

  for (const title of desired) {
    if (!milestoneMap.has(title)) {
      try {
        const res = await octokit.issues.createMilestone({ owner, repo, title });
        milestoneMap.set(title, res.data.number);
        createdCount++;
      } catch {
        // milestone already exists
      }
    }
  }

  return { milestonesCreated: createdCount, milestoneMap };
}
