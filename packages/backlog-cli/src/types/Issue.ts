import { Priority, IssueType } from './Enums.js';

export interface Issue {
  id: string;
  title: string;
  type?: IssueType | string;
  priority?: Priority;
  estimate?: number | string;
  dependencies?: string[];
  labels?: string[];
  acceptance_criteria?: string[];
  definition_of_done?: string[];
  lifecycle?: { phase?: string };
  implementation?: { layer?: string };
  milestone?: string;
  status?: 'todo' | 'in_progress' | 'done' | 'blocked' | string;
  completedAt?: string;
  completedBy?: string;
  featureId?: string;
  epicId?: string;
  filePath?: string;
}
