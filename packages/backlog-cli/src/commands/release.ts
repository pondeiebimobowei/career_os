import pc from 'picocolors';
import { BacklogService } from '../services/backlogService.js';

export async function releaseCommand(milestoneName: string = 'beta', options: { cwd?: string } = {}) {
  const service = new BacklogService(options.cwd);
  const backlog = await service.load();

  console.log(pc.bold(pc.cyan(`\n=== Release Notes (${milestoneName.toUpperCase()}) ===\n`)));
  console.log(`*Generated on ${new Date().toISOString().split('T')[0]}*\n`);

  for (const epic of backlog.epics) {
    console.log(`## ${epic.title}`);
    for (const feat of epic.features) {
      for (const issue of feat.issues) {
        console.log(`- **${issue.id}**: ${issue.title}`);
      }
    }
    console.log('');
  }
}
