import pc from 'picocolors';
import { HumanContextBundle } from '../../application/contextAssembler.js';

export class ExplainRenderer {
  static render(bundle: HumanContextBundle): void {
    const { issue, acceptanceCriteria, upstreamDependencies, downstreamImpact, relatedADRs, definitionOfDone } = bundle;

    console.log(pc.bold(pc.cyan(`\n=== Issue Explanation: [${issue.id}] ===\n`)));
    console.log(pc.bold('Title:'));
    console.log(issue.title + '\n');

    console.log(pc.bold('Priority & Estimate:'));
    console.log(`Priority: ${issue.priority || 'P1'} | Estimate: ${issue.estimate || 2} pts\n`);

    console.log(pc.bold('Acceptance Criteria:'));
    if (acceptanceCriteria.length > 0) {
      acceptanceCriteria.forEach((ac) => console.log(`  - [ ] ${ac}`));
    } else {
      console.log('  None specified');
    }
    console.log();

    console.log(pc.bold('Upstream Dependencies:'));
    console.log(upstreamDependencies.length > 0 ? upstreamDependencies.join(', ') : 'None');
    console.log();

    console.log(pc.bold('Downstream Impact:'));
    console.log(downstreamImpact.length > 0 ? downstreamImpact.join(', ') : 'None');
    console.log();

    console.log(pc.bold('Related ADRs & Specs:'));
    console.log(relatedADRs.join(', ') + '\n');

    console.log(pc.bold('Definition of Done:'));
    definitionOfDone.forEach((dod) => console.log(`  ✓ ${dod}`));
    console.log();
  }
}
