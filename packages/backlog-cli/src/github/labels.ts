import { Octokit } from '@octokit/rest';
import { BacklogModel } from '../parser/types.js';

export interface LabelSyncResult {
  labelsCreated: number;
  existingLabels: string[];
}

export async function syncLabels(
  octokit: Octokit | null,
  owner: string,
  repo: string,
  model: BacklogModel,
  dryRun: boolean
): Promise<LabelSyncResult> {
  const labelSet = new Set<string>();

  // Extract all labels from issues
  for (const issue of model.issues) {
    if (issue.labels) {
      issue.labels.forEach((l) => labelSet.add(l));
    }
    if (issue.priority) {
      labelSet.add(issue.priority.toLowerCase());
    }
    if (issue.type) {
      labelSet.add(issue.type.toLowerCase());
    }
  }

  const desiredLabels = Array.from(labelSet);

  if (!octokit || dryRun) {
    return {
      labelsCreated: desiredLabels.length,
      existingLabels: desiredLabels,
    };
  }

  let existingLabels: string[] = [];
  try {
    const { data } = await octokit.issues.listLabelsForRepo({ owner, repo, per_page: 100 });
    existingLabels = data.map((l) => l.name);
  } catch {
    existingLabels = [];
  }

  let createdCount = 0;
  for (const labelName of desiredLabels) {
    if (!existingLabels.includes(labelName)) {
      try {
        await octokit.issues.createLabel({
          owner,
          repo,
          name: labelName,
          color: '0366d6',
        });
        createdCount++;
      } catch {
        // label might already exist or API error
      }
    }
  }

  return {
    labelsCreated: createdCount,
    existingLabels: Array.from(new Set([...existingLabels, ...desiredLabels])),
  };
}
