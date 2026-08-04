export enum PriorityEnum {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
}

export enum IssueTypeEnum {
  TASK = 'task',
  BUG = 'bug',
  RESEARCH = 'research',
  SPIKE = 'spike',
  REFACTOR = 'refactor',
  CHORE = 'chore',
}

export enum StandardMilestones {
  FOUNDATION = 'FOUNDATION',
  CORE_TRACKER = 'CORE_TRACKER',
  PRODUCTIVITY = 'PRODUCTIVITY',
  CAPTURE = 'CAPTURE',
  MVP_POLISH = 'MVP_POLISH',
  BETA = 'BETA',
  POST_MVP = 'POST_MVP',
  V2 = 'V2',
}

export const STANDARD_LABELS = [
  'priority:P0',
  'priority:P1',
  'priority:P2',
  'priority:P3',
  'backend',
  'frontend',
  'extension',
  'api',
  'documentation',
  'design',
  'testing',
  'security',
  'performance',
  'accessibility',
  'epic',
  'feature',
  'task',
  'bug',
];
