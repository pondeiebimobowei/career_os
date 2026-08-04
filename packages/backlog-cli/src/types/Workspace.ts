import { Priority } from './Enums.js';

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

export interface CatalogEntry {
  id: string;
  file: string;
}

export interface CatalogConfig {
  product?: CatalogEntry[];
  engineering?: CatalogEntry[];
  release?: CatalogEntry[];
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
