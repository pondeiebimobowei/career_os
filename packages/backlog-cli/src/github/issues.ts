import { Octokit } from '@octokit/rest';
import { Backlog } from '../types/backlog.js';
import { IssueService } from '../services/issueService.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function syncIssues(
  octokit: Octokit | null,
  owner: string,
  repo: string,
  backlog: Backlog,
  milestoneMap: Map<string, number>,
  dryRun: boolean
): Promise<{ issuesCreated: number; issuesUpdated: number }> {
  if (!octokit) {
    return { issuesCreated: 0, issuesUpdated: 0 };
  }
  if (dryRun) {
    return { issuesCreated: backlog.issues.length, issuesUpdated: 0 };
  }

  const existingMap = new Map<string, { number: number; title: string; body: string }>();

  try {
    const allIssues = await octokit.paginate(octokit.issues.listForRepo, { owner, repo, state: 'all', per_page: 100 });
    for (const ghIss of allIssues) {
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
    // API error listing existing issues
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
      let attempts = 0;
      while (attempts < 3) {
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
          await sleep(250);
          break;
        } catch (err: any) {
          attempts++;
          if (err.status === 403) {
            await sleep(2000);
          } else {
            await sleep(500);
          }
        }
      }
    } else {
      if (existing.title !== formattedTitle || existing.body !== body) {
        let attempts = 0;
        while (attempts < 3) {
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
            await sleep(200);
            break;
          } catch (err: any) {
            attempts++;
            if (err.status === 403) {
              await sleep(2000);
            } else {
              await sleep(500);
            }
          }
        }
      }
    }
  }

  return { issuesCreated: createdCount, issuesUpdated: updatedCount };
}
