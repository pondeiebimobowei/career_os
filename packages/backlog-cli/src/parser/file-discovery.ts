import fs from 'node:fs';
import path from 'node:path';

export interface DiscoveredBacklog {
  backlogDir: string;
  readmePath: string;
  workspacePath: string;
}

export function discoverBacklogFiles(searchStartDir: string = process.cwd()): DiscoveredBacklog | null {
  let curr = path.resolve(searchStartDir);
  while (curr !== path.parse(curr).root) {
    const candidateDocs = path.join(curr, 'docs', 'backlog');
    if (fs.existsSync(path.join(candidateDocs, 'README.yaml'))) {
      return {
        backlogDir: candidateDocs,
        readmePath: path.join(candidateDocs, 'README.yaml'),
        workspacePath: path.join(candidateDocs, '99-workspace.yaml'),
      };
    }

    if (fs.existsSync(path.join(curr, 'README.yaml')) && fs.existsSync(path.join(curr, '99-workspace.yaml'))) {
      return {
        backlogDir: curr,
        readmePath: path.join(curr, 'README.yaml'),
        workspacePath: path.join(curr, '99-workspace.yaml'),
      };
    }

    curr = path.dirname(curr);
  }
  return null;
}
