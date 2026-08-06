import { Result, ok, fail } from '../core/result.js';
import { Issue, Backlog } from '../types/backlog.js';

export interface HumanContextBundle {
  issue: Issue;
  objective: string;
  acceptanceCriteria: string[];
  upstreamDependencies: string[];
  downstreamImpact: string[];
  relatedADRs: string[];
  definitionOfDone: string[];
}

export interface AIContextBundle extends HumanContextBundle {
  codingStandards: string[];
  suggestedFiles: string[];
}

export class HumanContextAssembler {
  static assemble(issue: Issue, backlog: Backlog): Result<HumanContextBundle> {
    const upstream = issue.dependencies || [];
    const downstream = backlog.issues
      .filter((i) => (i.dependencies || []).includes(issue.id))
      .map((i) => i.id);

    return ok({
      issue,
      objective: issue.title,
      acceptanceCriteria: issue.acceptance_criteria || [],
      upstreamDependencies: upstream,
      downstreamImpact: downstream,
      relatedADRs: ['ADR-001', 'ADR-002', 'ADR-007', 'ADR-031'],
      definitionOfDone: [
        'Implementation complete',
        'Tests pass cleanly',
        'Type checking passes',
        'Linting passes',
        'Docs updated',
      ],
    });
  }
}

export class AIContextAssembler {
  static assemble(issue: Issue, backlog: Backlog): Result<AIContextBundle> {
    const humanRes = HumanContextAssembler.assemble(issue, backlog);
    if (!humanRes.success) return humanRes;

    return ok({
      ...humanRes.data,
      codingStandards: [
        'Use TypeScript strict mode',
        'Enforce clean 4-layer architecture',
        'Return Result<T> monad types',
        'Use Conventional Commits',
      ],
      suggestedFiles: [
        issue.filePath || '',
        'packages/backlog-cli/src/cli.ts',
      ].filter(Boolean),
    });
  }
}
