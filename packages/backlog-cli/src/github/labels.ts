import { Octokit } from '@octokit/rest';
import { Backlog } from '../types/backlog.js';
import { STANDARD_LABELS } from '../schema/enums.js';

export async function syncLabels(
  octokit: Octokit | null,
  owner: string,
  repo: string,
  backlog: Backlog,
  dryRun: boolean
): Promise<{ labelsCreated: number }> {
  const desired = new Set<string>(STANDARD_LABELS);

  for (const issue of backlog.issues) {
    if (issue.labels) issue.labels.forEach((l) => desired.add(l));
    if (issue.priority) desired.add(`priority:${issue.priority}`);
    if (issue.type) desired.add(issue.type);
  }

  const labelList = Array.from(desired);

  if (!octokit || dryRun) {
    return { labelsCreated: labelList.length };
  }

  let existing: string[] = [];
  try {
    const res = await octokit.issues.listLabelsForRepo({ owner, repo, per_page: 100 });
    existing = res.data.map((l) => l.name);
  } catch {
    existing = [];
  }

  let createdCount = 0;
  for (const name of labelList) {
    if (!existing.includes(name)) {
      try {
        await octokit.issues.createLabel({
          owner,
          repo,
          name,
          color: '0366d6',
        });
        createdCount++;
      } catch {
        // label already exists or error
      }
    }
  }

  return { labelsCreated: createdCount };
}
