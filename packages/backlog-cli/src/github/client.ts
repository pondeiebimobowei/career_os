import { Octokit } from '@octokit/rest';
import { WorkspaceConfig } from '../parser/types.js';

export function getGitHubCredentials(workspace: WorkspaceConfig) {
  const owner = process.env.GITHUB_OWNER || workspace.github?.owner || 'ebimopondei';
  const repo = process.env.GITHUB_REPOSITORY || workspace.github?.repository || 'careeros';
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

  return { owner, repo, token };
}

export function createOctokitClient(workspace: WorkspaceConfig): { octokit: Octokit | null; owner: string; repo: string; token: string } {
  const { owner, repo, token } = getGitHubCredentials(workspace);
  if (!token) {
    return { octokit: null, owner, repo, token: '' };
  }
  const octokit = new Octokit({ auth: token });
  return { octokit, owner, repo, token };
}
