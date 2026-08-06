import { Result, ok, fail } from '../core/result.js';
import { ValidationError } from '../core/errors.js';
import { Issue } from '../types/backlog.js';
import { GitAdapter } from '../infrastructure/git/adapter.js';

export interface PreFinishVerification {
  issueExists: boolean;
  branchMatches: boolean;
  hasAcceptanceCriteria: boolean;
  isCleanOrStaged: boolean;
}

export class VerificationService {
  static verifyPreFinish(issue: Issue, cwd: string = process.cwd()): Result<PreFinishVerification> {
    const gitRes = GitAdapter.getStatus(cwd);
    if (!gitRes.success) return gitRes;

    const currentBranch = gitRes.data.branch.toLowerCase();
    const issueIdLower = issue.id.toLowerCase();
    const branchMatches = currentBranch.includes(issueIdLower) || currentBranch === 'main';

    const hasAcceptanceCriteria =
      Array.isArray(issue.acceptance_criteria) && issue.acceptance_criteria.length > 0;

    if (!hasAcceptanceCriteria) {
      return fail(new ValidationError(`Issue ${issue.id} has empty acceptance criteria`));
    }

    return ok({
      issueExists: true,
      branchMatches,
      hasAcceptanceCriteria,
      isCleanOrStaged: true,
    });
  }
}
