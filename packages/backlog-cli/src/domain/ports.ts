import { Result } from '../core/result.js';
import { Issue, Milestone } from '../types/backlog.js';

export interface SyncPort {
  syncIssues(issues: Issue[], milestones: Milestone[]): Promise<Result<{ synced: number }>>;
}

export interface NotificationPort {
  notifyIssueCompleted(issueId: string, title: string): Promise<void>;
  notifyMilestoneCompleted(milestoneName: string): Promise<void>;
}

export interface StoragePort {
  readText(filePath: string): Promise<Result<string>>;
  writeText(filePath: string, content: string): Promise<Result<void>>;
  exists(filePath: string): Promise<boolean>;
}
