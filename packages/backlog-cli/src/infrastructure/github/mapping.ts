import fs from 'node:fs';
import path from 'node:path';

export interface GitHubBacklogMap {
  version: '1.0.0';
  lastSyncedAt: string;
  issues: Record<string, number>;
}

export class GitHubMappingStore {
  private static mapFilePath(workspaceRoot: string): string {
    const dir = path.join(workspaceRoot, '.github');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, 'backlog-map.json');
  }

  static load(workspaceRoot: string = process.cwd()): GitHubBacklogMap {
    const file = this.mapFilePath(workspaceRoot);
    if (!fs.existsSync(file)) {
      return { version: '1.0.0', lastSyncedAt: new Date().toISOString(), issues: {} };
    }
    try {
      const content = fs.readFileSync(file, 'utf-8');
      return JSON.parse(content);
    } catch {
      return { version: '1.0.0', lastSyncedAt: new Date().toISOString(), issues: {} };
    }
  }

  static save(map: GitHubBacklogMap, workspaceRoot: string = process.cwd()): void {
    const file = this.mapFilePath(workspaceRoot);
    map.lastSyncedAt = new Date().toISOString();
    fs.writeFileSync(file, JSON.stringify(map, null, 2), 'utf-8');
  }

  static getIssueNumber(issueId: string, workspaceRoot: string = process.cwd()): number | undefined {
    const map = this.load(workspaceRoot);
    return map.issues[issueId.toUpperCase()];
  }

  static setIssueNumber(issueId: string, issueNumber: number, workspaceRoot: string = process.cwd()): void {
    const map = this.load(workspaceRoot);
    map.issues[issueId.toUpperCase()] = issueNumber;
    this.save(map, workspaceRoot);
  }
}
