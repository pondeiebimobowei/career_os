import { Octokit } from '@octokit/rest';
import { Backlog } from '../types/backlog.js';
import { IssueService } from '../services/issueService.js';
import { GitHubMappingStore } from '../infrastructure/github/mapping.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function syncIssues(
  octokit: Octokit | null,
  owner: string,
  repo: string,
  backlog: Backlog,
  milestoneMap: Map<string, number>,
  dryRun: boolean,
  workspaceRoot: string = process.cwd()
): Promise<{ issuesCreated: number; issuesUpdated: number }> {
  if (!octokit) {
    return { issuesCreated: 0, issuesUpdated: 0 };
  }
  if (dryRun) {
    return { issuesCreated: backlog.issues.length, issuesUpdated: 0 };
  }

  const mapping = GitHubMappingStore.load(workspaceRoot);
  const existingMap = new Map<number, { number: number; title: string; body: string; state: string }>();

  try {
    const allIssues = await octokit.paginate(octokit.issues.listForRepo, {
      owner,
      repo,
      state: 'all',
      per_page: 100,
    });

    for (const ghIss of allIssues) {
      if (ghIss.pull_request) continue;
      existingMap.set(ghIss.number, {
        number: ghIss.number,
        title: ghIss.title,
        body: ghIss.body || '',
        state: ghIss.state,
      });
    }
  } catch {
    // API listing error
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
    const targetState: 'open' | 'closed' = (issue.status || 'todo').toLowerCase() === 'done' ? 'closed' : 'open';

    const mappedNumber = mapping.issues[issue.id.toUpperCase()];
    const existing = mappedNumber ? existingMap.get(mappedNumber) : undefined;

    if (!existing) {
      // Create issue and persist mapping
      try {
        const created = await octokit.issues.create({
          owner,
          repo,
          title: formattedTitle,
          body,
          labels,
          milestone: msNum,
        });

        const newNum = created.data.number;
        GitHubMappingStore.setIssueNumber(issue.id, newNum, workspaceRoot);

        if (targetState === 'closed') {
          await octokit.issues.update({
            owner,
            repo,
            issue_number: newNum,
            state: 'closed',
          });
        }

        createdCount++;
        await sleep(300);
      } catch {
        // Ignored rate limit error
      }
    } else {
      // Reconcile primary issue title, body, labels, milestone, and state
      if (existing.title !== formattedTitle || existing.body !== body || existing.state !== targetState) {
        try {
          await octokit.issues.update({
            owner,
            repo,
            issue_number: existing.number,
            title: formattedTitle,
            body,
            labels,
            milestone: msNum,
            state: targetState,
          });
          updatedCount++;
          await sleep(250);
        } catch {
          // Ignored update error
        }
      }
    }
  }

  return { issuesCreated: createdCount, issuesUpdated: updatedCount };
}

export async function repairIssues(
  octokit: Octokit | null,
  owner: string,
  repo: string,
  backlog: Backlog,
  milestoneMap: Map<string, number>,
  dryRun: boolean,
  workspaceRoot: string = process.cwd()
): Promise<{ duplicatesClosed: number; issuesReconciled: number }> {
  if (!octokit || dryRun) {
    return { duplicatesClosed: 0, issuesReconciled: 0 };
  }

  const existingMap = new Map<string, { number: number; title: string; body: string; state: string }[]>();

  try {
    const allIssues = await octokit.paginate(octokit.issues.listForRepo, {
      owner,
      repo,
      state: 'all',
      per_page: 100,
    });

    for (const ghIss of allIssues) {
      if (ghIss.pull_request) continue;
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
    // API error
  }

  let duplicatesClosed = 0;
  let issuesReconciled = 0;

  for (const [id, list] of existingMap.entries()) {
    if (list.length > 1) {
      // Keep primary (first/lowest issue number)
      const primary = list[0];
      GitHubMappingStore.setIssueNumber(id, primary.number, workspaceRoot);

      for (let i = 1; i < list.length; i++) {
        const dup = list[i];
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
    } else if (list.length === 1) {
      GitHubMappingStore.setIssueNumber(id, list[0].number, workspaceRoot);
    }
  }

  // Reconcile remaining issues
  const syncRes = await syncIssues(octokit, owner, repo, backlog, milestoneMap, dryRun, workspaceRoot);
  issuesReconciled = syncRes.issuesUpdated;

  return { duplicatesClosed, issuesReconciled };
}
