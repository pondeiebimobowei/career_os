export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

export type IssueType = 'task' | 'bug' | 'research' | 'spike' | 'refactor' | 'chore';

export interface Issue {
  id: string;
  title: string;
  type?: IssueType | string;
  priority?: Priority;
  estimate?: number;
  dependencies?: string[];
  labels?: string[];
  acceptance_criteria?: string[];
  definition_of_done?: string[];
  lifecycle?: { phase?: string };
  implementation?: { layer?: string };
  milestone?: string;
  featureId?: string;
  epicId?: string;
  filePath?: string;
}

export interface Feature {
  id: string;
  title: string;
  priority?: Priority;
  issues: Issue[];
  epicId?: string;
  filePath?: string;
}

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

export interface CatalogEntry {
  id: string;
  file: string;
}

export interface CatalogConfig {
  product?: CatalogEntry[];
  engineering?: CatalogEntry[];
  release?: CatalogEntry[];
}

export interface WorkspaceConfig {
  name: string;
  schema?: string;
  github?: {
    owner: string;
    repository: string;
  };
  current?: {
    milestone?: string;
    sprint?: string;
    release?: string;
  };
  enabled_domains?: {
    product?: string[];
    engineering?: string[];
    release?: string[];
  };
  automation?: {
    issue_prefix?: string;
    default_priority?: Priority;
    default_estimate?: number;
    validate_before_sync?: boolean;
    dependency_validation?: boolean;
    strict_schema?: boolean;
  };
  rules?: {
    allow_cross_domain_dependencies?: boolean;
    allow_future_scope_sync?: boolean;
    sync_only_enabled_domains?: boolean;
    require_acceptance_criteria?: boolean;
  };
  paths?: {
    backlog_root?: string;
    product?: string;
    engineering?: string;
    release?: string;
  };
}

export interface ReadmeConfig {
  version?: number;
  project?: {
    name: string;
    backlog_schema?: string;
  };
  catalog?: CatalogConfig;
  entrypoints?: {
    workspace?: string;
    schema?: string;
  };
  automation?: {
    discovery_order?: string[];
  };
}

export interface DomainFile {
  filePath: string;
  domainCategory: 'product' | 'engineering' | 'release';
  domainName: string;
  rawYaml: any;
  epic?: Epic;
}

export interface ValidationError {
  type: 'SCHEMA' | 'ID_DUPLICATE' | 'DEPENDENCY_NOT_FOUND' | 'CIRCULAR_DEPENDENCY' | 'MILESTONE_INVALID' | 'HEALTH_WARNING';
  code: string;
  message: string;
  filePath?: string;
  id?: string;
  severity: 'error' | 'warning';
}

export interface BacklogModel {
  workspace: WorkspaceConfig;
  readme: ReadmeConfig;
  epics: Epic[];
  features: Feature[];
  issues: Issue[];
  issuesById: Map<string, Issue>;
  featuresById: Map<string, Feature>;
  epicsById: Map<string, Epic>;
  domainFiles: DomainFile[];
  parseErrors: ValidationError[];
}
