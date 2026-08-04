import { BacklogService } from '../services/backlogService.js';
import { MilestoneService } from '../services/milestoneService.js';

export async function statusCommand(options: { cwd?: string } = {}) {
  const service = new BacklogService(options.cwd);
  const backlog = await service.load();
  const reportText = MilestoneService.generateStatusReport(backlog);
  console.log(reportText);
}
