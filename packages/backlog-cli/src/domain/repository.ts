import { Result, ok, fail } from '../core/result.js';
import { NotFoundError } from '../core/errors.js';
import { Backlog, Issue, Feature, Epic } from '../types/backlog.js';
import { BacklogLoader } from '../parser/loader.js';
import { YamlPersistence } from '../infrastructure/persistence/yaml.js';

export interface MilestoneProgress {
  milestone: string;
  total: number;
  done: number;
  inProgress: number;
  todo: number;
  blocked: number;
  percentage: number;
}

export interface IBacklogRepository {
  load(): Promise<Result<Backlog>>;
  findIssue(id: string): Promise<Result<Issue>>;
  updateIssue(id: string, patch: Partial<Issue>): Promise<Result<Issue>>;
  findFeature(id: string): Promise<Result<Feature>>;
  findEpic(id: string): Promise<Result<Epic>>;
  computeMilestoneProgress(milestone: string): Promise<Result<MilestoneProgress>>;
}

export class BacklogRepository implements IBacklogRepository {
  private cachedBacklog: Backlog | null = null;

  constructor(private readonly startDir: string = process.cwd()) {}

  async load(forceReload: boolean = false): Promise<Result<Backlog>> {
    try {
      if (!this.cachedBacklog || forceReload) {
        this.cachedBacklog = await BacklogLoader.loadBacklog(this.startDir);
      }
      return ok(this.cachedBacklog);
    } catch (err: any) {
      return fail(err);
    }
  }

  async findIssue(id: string): Promise<Result<Issue>> {
    const backlogRes = await this.load();
    if (!backlogRes.success) return backlogRes;

    const issue = backlogRes.data.issuesById.get(id.toUpperCase());
    if (!issue) {
      return fail(new NotFoundError(`Issue "${id}" not found in backlog`));
    }
    return ok(issue);
  }

  async updateIssue(id: string, patch: Partial<Issue>): Promise<Result<Issue>> {
    const issueRes = await this.findIssue(id);
    if (!issueRes.success) return issueRes;

    const issue = issueRes.data;
    if (!issue.filePath) {
      return fail(new NotFoundError(`File path for issue "${id}" is missing`));
    }

    const updatedIssue = { ...issue, ...patch };
    const persistRes = await YamlPersistence.updateIssueInFile(issue.filePath, id, patch);
    if (!persistRes.success) return persistRes;

    // Refresh cache after persistence
    await this.load(true);
    return ok(updatedIssue);
  }

  async findFeature(id: string): Promise<Result<Feature>> {
    const backlogRes = await this.load();
    if (!backlogRes.success) return backlogRes;

    const feature = backlogRes.data.featuresById.get(id.toUpperCase());
    if (!feature) {
      return fail(new NotFoundError(`Feature "${id}" not found`));
    }
    return ok(feature);
  }

  async findEpic(id: string): Promise<Result<Epic>> {
    const backlogRes = await this.load();
    if (!backlogRes.success) return backlogRes;

    const epic = backlogRes.data.epicsById.get(id.toUpperCase());
    if (!epic) {
      return fail(new NotFoundError(`Epic "${id}" not found`));
    }
    return ok(epic);
  }

  async computeMilestoneProgress(milestoneName: string): Promise<Result<MilestoneProgress>> {
    const backlogRes = await this.load();
    if (!backlogRes.success) return backlogRes;

    const targetMilestone = milestoneName.toUpperCase();
    const issues = backlogRes.data.issues.filter(
      (i) => (i.milestone || '').toUpperCase() === targetMilestone
    );

    const total = issues.length;
    let done = 0;
    let inProgress = 0;
    let todo = 0;
    let blocked = 0;

    for (const issue of issues) {
      const status = (issue.status || 'todo').toLowerCase();
      if (status === 'done') done++;
      else if (status === 'in_progress') inProgress++;
      else if (status === 'blocked') blocked++;
      else todo++;
    }

    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    return ok({
      milestone: milestoneName,
      total,
      done,
      inProgress,
      todo,
      blocked,
      percentage,
    });
  }
}
