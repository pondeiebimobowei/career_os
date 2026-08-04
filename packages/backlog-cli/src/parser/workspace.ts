import fs from 'node:fs';
import path from 'node:path';
import { parseYamlFile } from './yaml.js';
import { ReadmeConfig, WorkspaceConfig, ValidationError } from './types.js';

export interface WorkspaceLocation {
  backlogDir: string;
  readmePath: string;
  workspacePath: string;
}

export function locateBacklogRoot(searchStartDir: string = process.cwd()): WorkspaceLocation | null {
  let curr = path.resolve(searchStartDir);
  while (curr !== path.parse(curr).root) {
    const candidateDocs = path.join(curr, 'docs', 'backlog');
    if (fs.existsSync(path.join(candidateDocs, 'README.yaml'))) {
      return {
        backlogDir: candidateDocs,
        readmePath: path.join(candidateDocs, 'README.yaml'),
        workspacePath: path.join(candidateDocs, '99-workspace.yaml'),
      };
    }

    if (fs.existsSync(path.join(curr, 'README.yaml')) && fs.existsSync(path.join(curr, '99-workspace.yaml'))) {
      return {
        backlogDir: curr,
        readmePath: path.join(curr, 'README.yaml'),
        workspacePath: path.join(curr, '99-workspace.yaml'),
      };
    }

    curr = path.dirname(curr);
  }
  return null;
}

export function loadWorkspaceAndReadme(location: WorkspaceLocation): {
  readme: ReadmeConfig | null;
  workspace: WorkspaceConfig | null;
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];

  const readmeRes = parseYamlFile<ReadmeConfig>(location.readmePath);
  if (readmeRes.error) {
    errors.push(readmeRes.error);
  }

  const workspaceRes = parseYamlFile<any>(location.workspacePath);
  let normalizedWorkspace: WorkspaceConfig | null = null;

  if (workspaceRes.error) {
    errors.push(workspaceRes.error);
  } else if (workspaceRes.data) {
    const raw = workspaceRes.data;
    normalizedWorkspace = {
      name: raw.workspace?.name || raw.name || 'CareerOS',
      schema: raw.workspace?.schema || raw.schema,
      github: raw.project?.github || raw.github,
      current: raw.current,
      enabled_domains: raw.enabled_domains,
      automation: raw.automation,
      rules: raw.rules,
      paths: raw.paths,
    };
  }

  return {
    readme: readmeRes.data,
    workspace: normalizedWorkspace,
    errors,
  };
}
