export const CBS_SCHEMA_VERSION = 'CBS-v1.0';

export const VALID_PRIORITIES = ['P0', 'P1', 'P2', 'P3'] as const;
export const VALID_ISSUE_TYPES = ['task', 'bug', 'research', 'spike', 'refactor', 'chore'] as const;
export const VALID_MILESTONES = [
  'FOUNDATION',
  'CORE_TRACKER',
  'PRODUCTIVITY',
  'CAPTURE',
  'MVP_POLISH',
  'BETA',
  'POST_MVP',
] as const;
export const VALID_STATUSES = ['todo', 'in_progress', 'done', 'blocked'] as const;

