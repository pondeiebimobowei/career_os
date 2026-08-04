import { Octokit } from '@octokit/rest';
import { WorkspaceConfig } from '../types/backlog.js';

export function createGitHubClient(workspace: WorkspaceConfig): {
  octokit: Octokit | null;
  owner: string;
  repo: string;
} {
  const owner = process.env.GITHUB_OWNER || workspace.github?.owner || 'ebimopondei';
  const repo = process.env.GITHUB_REPOSITORY || workspace.github?.repository || 'careeros';
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

  if (!token) {
    return { octokit: null, owner, repo };
  }

  const octokit = new Octokit({ auth: token });
  return { octokit, owner, repo };
}
