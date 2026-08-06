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
): Promise<{ issuesCreated: number; issuesUpdated: number; duplicatesClosed: number }> {
  if (!octokit) {
    return { issuesCreated: 0, issuesUpdated: 0, duplicatesClosed: 0 };
  }
  if (dryRun) {
    return { issuesCreated: backlog.issues.length, issuesUpdated: 0, duplicatesClosed: 0 };
  }

  // Map backlogId -> list of GH issue numbers & objects
  const existingMap = new Map<string, { number: number; title: string; body: string; state: string }[]>();

  try {
    const allIssues = await octokit.paginate(octokit.issues.listForRepo, {
      owner,
      repo,
      state: 'all',
      per_page: 100,
    });

    for (const ghIss of allIssues) {
      if (ghIss.pull_request) continue; // Ignore PRs

      let backlogId: string | null = null;
      const titleMatch = ghIss.title.match(/^\[([A-Z0-9-]+)\]/);
      if (titleMatch && titleMatch[1]) {
        backlogId = titleMatch[1].toUpperCase();
      } else {
        const bodyMatch = (ghIss.body || '').match(/<!--\s*backlog-id:\s*([A-Z0-9-]+)\s*-->/i);
        if (bodyMatch && bodyMatch[1]) {
          backlogId = bodyMatch[1].toUpperCase();
        }
      }

      if (backlogId) {
        const list = existingMap.get(backlogId) || [];
        list.push({
          number: ghIss.number,
          title: ghIss.title,
          body: ghIss.body || '',
          state: ghIss.state,
        });
        existingMap.set(backlogId, list);
      }
    }
  } catch {
    // API error listing existing issues
  }

  let createdCount = 0;
  let updatedCount = 0;
  let duplicatesClosed = 0;

  for (const issue of backlog.issues) {
    const formattedTitle = `[${issue.id}] ${issue.title}`;
    const body = IssueService.formatGitHubIssueBody(issue);
    const labels = [
      ...(issue.labels || []),
      ...(issue.priority ? [`priority:${issue.priority}`] : []),
      ...(issue.type ? [issue.type] : []),
    ];
    const msNum = issue.milestone ? milestoneMap.get(issue.milestone) : undefined;
    const targetState: 'open' | 'closed' = (issue.status || 'todo').toLowerCase() === 'done' ? 'closed' : 'open';

    const existingList = existingMap.get(issue.id.toUpperCase()) || [];

    if (existingList.length === 0) {
      // Create new issue
      let attempts = 0;
      while (attempts < 3) {
        try {
          const created = await octokit.issues.create({
            owner,
            repo,
            title: formattedTitle,
            body,
            labels,
            milestone: msNum,
          });

          if (targetState === 'closed') {
            await octokit.issues.update({
              owner,
              repo,
              issue_number: created.data.number,
              state: 'closed',
            });
          }

          createdCount++;
          await sleep(300);
          break;
        } catch (err: any) {
          attempts++;
          await sleep(err.status === 403 ? 2000 : 500);
        }
      }
    } else {
      // Primary issue is the first one found (lowest issue number)
      const primary = existingList[0];

      // Close any extra duplicate issues
      for (let i = 1; i < existingList.length; i++) {
        const dup = existingList[i];
        if (dup.state !== 'closed') {
          try {
            await octokit.issues.createComment({
              owner,
              repo,
              issue_number: dup.number,
              body: `Closing duplicate issue in favor of #${primary.number}`,
            });
            await octokit.issues.update({
              owner,
              repo,
              issue_number: dup.number,
              state: 'closed',
            });
            duplicatesClosed++;
            await sleep(200);
          } catch {
            // Ignored dup close error
          }
        }
      }

      // Reconcile primary issue title, body, labels, milestone, and state
      if (primary.title !== formattedTitle || primary.body !== body || primary.state !== targetState) {
        let attempts = 0;
        while (attempts < 3) {
          try {
            await octokit.issues.update({
              owner,
              repo,
              issue_number: primary.number,
              title: formattedTitle,
              body,
              labels,
              milestone: msNum,
              state: targetState,
            });
            updatedCount++;
            await sleep(250);
            break;
          } catch (err: any) {
            attempts++;
            await sleep(err.status === 403 ? 2000 : 500);
          }
        }
      }
    }
  }

  return { issuesCreated: createdCount, issuesUpdated: updatedCount, duplicatesClosed };
}
