import { Octokit } from '@octokit/rest';
import { Backlog } from '../types/backlog.js';
import { IssueService } from '../services/issueService.js';

export async function syncIssues(
  octokit: Octokit | null,
  owner: string,
  repo: string,
  backlog: Backlog,
  milestoneMap: Map<string, number>,
  dryRun: boolean
): Promise<{ issuesCreated: number; issuesUpdated: number }> {
  if (!octokit || dryRun) {
    return { issuesCreated: backlog.issues.length, issuesUpdated: 0 };
  }

  const existingMap = new Map<string, { number: number; title: string; body: string }>();

  try {
    const res = await octokit.issues.listForRepo({ owner, repo, state: 'all', per_page: 100 });
    for (const ghIss of res.data) {
      const match = ghIss.title.match(/\[([A-Z0-9-]+)\]/);
      if (match && match[1]) {
        existingMap.set(match[1], {
          number: ghIss.number,
          title: ghIss.title,
          body: ghIss.body || '',
        });
      }
    }
  } catch {
    // API error
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const issue of backlog.issues) {
    const formattedTitle = `[${issue.id}] ${issue.title}`;
    const body = IssueService.formatGitHubIssueBody(issue);
    const labels = [
      ...(issue.labels || []),
      ...(issue.priority ? [`priority:${issue.priority}`] : []),
      ...(issue.type ? [issue.type] : []),
    ];
    const msNum = issue.milestone ? milestoneMap.get(issue.milestone) : undefined;

    const existing = existingMap.get(issue.id);
    if (!existing) {
      try {
        await octokit.issues.create({
          owner,
          repo,
          title: formattedTitle,
          body,
          labels,
          milestone: msNum,
        });
        createdCount++;
      } catch {
        // error creating issue
      }
    } else {
      if (existing.title !== formattedTitle || existing.body !== body) {
        try {
          await octokit.issues.update({
            owner,
            repo,
            issue_number: existing.number,
            title: formattedTitle,
            body,
            labels,
            milestone: msNum,
          });
          updatedCount++;
        } catch {
          // error updating issue
        }
      }
    }
  }

  return { issuesCreated: createdCount, issuesUpdated: updatedCount };
}
