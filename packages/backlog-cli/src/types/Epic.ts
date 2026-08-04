import { Feature } from './Feature.js';

export interface Epic {
  id: string;
  title: string;
  type?: string;
  milestone?: string;
  objective?: string;
  dependencies?: string[];
  features: Feature[];
  filePath?: string;
}
