import { Priority } from './Enums.js';
import { Issue } from './Issue.js';

export interface Feature {
  id: string;
  title: string;
  priority?: Priority;
  issues: Issue[];
  epicId?: string;
  filePath?: string;
}
