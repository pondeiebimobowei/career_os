import { Octokit } from '@octokit/rest';
import { execSync } from 'node:child_process';
import { WorkspaceConfig } from '../types/backlog.js';

export function createGitHubClient(workspace: WorkspaceConfig): {
  octokit: Octokit | null;
  owner: string;
  repo: string;
} {
  const owner = process.env.GITHUB_OWNER || workspace.github?.owner || 'pondeiebimobowei';
  const repo = process.env.GITHUB_REPOSITORY || workspace.github?.repository || 'career_os';
  let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

  if (!token) {
    try {
      token = execSync('gh auth token', { encoding: 'utf-8' }).trim();
    } catch {
      // gh CLI token retrieval failed
    }
  }

  if (!token) {
    return { octokit: null, owner, repo };
  }

  const octokit = new Octokit({ auth: token });
  return { octokit, owner, repo };
}

