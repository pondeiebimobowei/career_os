import { Octokit } from '@octokit/rest';
import { BacklogModel } from '../parser/types.js';
import { KNOWN_MILESTONES } from '../validator/milestones.js';

export interface MilestoneSyncResult {
  milestonesCreated: number;
  milestoneMap: Map<string, number>; // title -> number
}

export async function syncMilestones(
  octokit: Octokit | null,
  owner: string,
  repo: string,
  model: BacklogModel,
  dryRun: boolean
): Promise<MilestoneSyncResult> {
  const milestoneTitles = new Set<string>(KNOWN_MILESTONES);
  for (const epic of model.epics) {
    if (epic.milestone) milestoneTitles.add(epic.milestone);
  }
  for (const issue of model.issues) {
    if (issue.milestone) milestoneTitles.add(issue.milestone);
  }

  const milestoneMap = new Map<string, number>();

  if (!octokit || dryRun) {
    let dummyNum = 1;
    for (const title of milestoneTitles) {
      milestoneMap.set(title, dummyNum++);
    }
    return {
      milestonesCreated: milestoneTitles.size,
      milestoneMap,
    };
  }

  let createdCount = 0;
  try {
    const { data } = await octokit.issues.listMilestones({ owner, repo, state: 'all' });
    for (const ms of data) {
      milestoneMap.set(ms.title, ms.number);
    }
  } catch {
    // Ignore error
  }

  for (const title of milestoneTitles) {
    if (!milestoneMap.has(title)) {
      try {
        const { data } = await octokit.issues.createMilestone({
          owner,
          repo,
          title,
        });
        milestoneMap.set(title, data.number);
        createdCount++;
      } catch {
        // Ignore error
      }
    }
  }

  return {
    milestonesCreated: createdCount,
    milestoneMap,
  };
}
