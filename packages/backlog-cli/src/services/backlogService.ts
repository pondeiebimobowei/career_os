import { BacklogLoader } from '../parser/loader.js';
import { BacklogValidator, ValidationSummary } from '../parser/validator.js';
import { BacklogPlanner } from '../parser/dependencyGraph.js';
import { Backlog } from '../types/backlog.js';

export class BacklogService {
  private startDir: string;

  constructor(startDir: string = process.cwd()) {
    this.startDir = startDir;
  }

  async load(): Promise<Backlog> {
    return BacklogLoader.loadBacklog(this.startDir);
  }

  async validate(): Promise<ValidationSummary> {
    const backlog = await this.load();
    return BacklogValidator.validate(backlog);
  }

  async getDependencyGraph(mermaid: boolean = false): Promise<string> {
    const backlog = await this.load();
    return BacklogPlanner.computeDependencyGraph(backlog, mermaid);
  }
}
