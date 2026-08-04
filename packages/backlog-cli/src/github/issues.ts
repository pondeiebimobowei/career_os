import { Octokit } from '@octokit/rest';
import { BacklogModel, Issue } from '../parser/types.js';

export interface IssueSyncResult {
  issuesCreated: number;
  issuesUpdated: number;
}

export function formatIssueBody(issue: Issue): string {
  const parts: string[] = [];
  parts.push(`## Description`);
  parts.push(`**ID:** ${issue.id}`);
  if (issue.priority) parts.push(`**Priority:** ${issue.priority}`);
  if (issue.estimate) parts.push(`**Estimate:** ${issue.estimate} pts`);
  if (issue.type) parts.push(`**Type:** ${issue.type}`);

  if (issue.dependencies && issue.dependencies.length > 0) {
    parts.push(`\n### Dependencies\n` + issue.dependencies.map((d) => `- ${d}`).join('\n'));
  }

  if (issue.acceptance_criteria && issue.acceptance_criteria.length > 0) {
    parts.push(`\n### Acceptance Criteria\n` + issue.acceptance_criteria.map((ac) => `- [ ] ${ac}`).join('\n'));
  }

  if (issue.definition_of_done && issue.definition_of_done.length > 0) {
    parts.push(`\n### Definition of Done\n` + issue.definition_of_done.map((dod) => `- [ ] ${dod}`).join('\n'));
  }

  return parts.join('\n');
}

export async function syncIssues(
  octokit: Octokit | null,
  owner: string,
  repo: string,
  model: BacklogModel,
  milestoneMap: Map<string, number>,
  dryRun: boolean
): Promise<IssueSyncResult> {
  if (!octokit || dryRun) {
    return {
      issuesCreated: model.issues.length,
      issuesUpdated: 0,
    };
  }

  // Fetch existing repo issues
  const existingIssuesMap = new Map<string, { number: number; title: string; body: string }>();
  try {
    const response = await octokit.issues.listForRepo({ owner, repo, state: 'all', per_page: 100 });
    for (const ghIss of response.data) {
      // Match "[APP-001]" in issue title
      const match = ghIss.title.match(/\[([A-Z0-9-]+)\]/);
      if (match && match[1]) {
        existingIssuesMap.set(match[1], {
          number: ghIss.number,
          title: ghIss.title,
          body: ghIss.body || '',
        });
      }
    }
  } catch {
    // repository issues list error
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const issue of model.issues) {
    const formattedTitle = `[${issue.id}] ${issue.title}`;
    const body = formatIssueBody(issue);
    const labels = [
      ...(issue.labels || []),
      ...(issue.priority ? [issue.priority.toLowerCase()] : []),
      ...(issue.type ? [issue.type.toLowerCase()] : []),
    ];
    const milestoneNumber = issue.milestone ? milestoneMap.get(issue.milestone) : undefined;

    const existing = existingIssuesMap.get(issue.id);
    if (!existing) {
      try {
        await octokit.issues.create({
          owner,
          repo,
          title: formattedTitle,
          body,
          labels,
          milestone: milestoneNumber,
        });
        createdCount++;
      } catch {
        // failed issue creation
      }
    } else {
      // Update issue if title or body changed
      if (existing.title !== formattedTitle || existing.body !== body) {
        try {
          await octokit.issues.update({
            owner,
            repo,
            issue_number: existing.number,
            title: formattedTitle,
            body,
            labels,
            milestone: milestoneNumber,
          });
          updatedCount++;
        } catch {
          // failed issue update
        }
      }
    }
  }

  return {
    issuesCreated: createdCount,
    issuesUpdated: updatedCount,
  };
}
