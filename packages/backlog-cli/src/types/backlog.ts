export * from './Enums.js';
export * from './Workspace.js';
export * from './Issue.js';
export * from './Feature.js';
export * from './Epic.js';
export * from './Milestone.js';

import { WorkspaceConfig, ReadmeConfig } from './Workspace.js';
import { Epic } from './Epic.js';
import { Feature } from './Feature.js';
import { Issue } from './Issue.js';
import { Severity } from './Enums.js';

export interface DomainFile {
  filePath: string;
  domainCategory: 'product' | 'engineering' | 'release';
  domainName: string;
  rawYaml: any;
  epic?: Epic;
}

export interface ValidationProblem {
  type: 'SCHEMA' | 'ID_DUPLICATE' | 'DEPENDENCY_NOT_FOUND' | 'CIRCULAR_DEPENDENCY' | 'MILESTONE_INVALID' | 'HEALTH_WARNING';
  code: string;
  message: string;
  filePath?: string;
  id?: string;
  severity: Severity;
}

export interface Backlog {
  workspace: WorkspaceConfig;
  readme: ReadmeConfig;
  epics: Epic[];
  features: Feature[];
  issues: Issue[];
  issuesById: Map<string, Issue>;
  featuresById: Map<string, Feature>;
  epicsById: Map<string, Epic>;
  domainFiles: DomainFile[];
  parseErrors: ValidationProblem[];
}
