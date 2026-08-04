import fs from 'node:fs';
import path from 'node:path';
import { readYamlFile } from '../utils/yaml.js';
import {
  Backlog,
  WorkspaceConfig,
  ReadmeConfig,
  CatalogEntry,
  DomainFile,
  Epic,
  Feature,
  Issue,
  ValidationProblem,
} from '../types/backlog.js';

export interface BacklogLocation {
  backlogDir: string;
  readmePath: string;
  workspacePath: string;
}

export class BacklogLoader {
  static locateBacklogRoot(searchStartDir: string = process.cwd()): BacklogLocation | null {
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

  static async loadBacklog(startDir: string = process.cwd()): Promise<Backlog> {
    const parseErrors: ValidationProblem[] = [];
    const location = this.locateBacklogRoot(startDir);

    if (!location) {
      return {
        workspace: { name: 'Unknown' },
        readme: {},
        epics: [],
        features: [],
        issues: [],
        issuesById: new Map(),
        featuresById: new Map(),
        epicsById: new Map(),
        domainFiles: [],
        parseErrors: [
          {
            type: 'SCHEMA',
            code: 'BACKLOG_NOT_FOUND',
            message: 'Could not locate backlog directory containing README.yaml and 99-workspace.yaml',
            severity: 'error',
          },
        ],
      };
    }

    const readmeRes = readYamlFile<ReadmeConfig>(location.readmePath);
    if (readmeRes.error) parseErrors.push(readmeRes.error);

    const workspaceRes = readYamlFile<any>(location.workspacePath);
    let workspace: WorkspaceConfig = { name: 'CareerOS' };
    if (workspaceRes.error) {
      parseErrors.push(workspaceRes.error);
    } else if (workspaceRes.data) {
      const raw = workspaceRes.data;
      workspace = {
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

    const readme = readmeRes.data || {};
    const model: Backlog = {
      workspace,
      readme,
      epics: [],
      features: [],
      issues: [],
      issuesById: new Map(),
      featuresById: new Map(),
      epicsById: new Map(),
      domainFiles: [],
      parseErrors,
    };

    const catalog = readme.catalog || {};
    const enabledDomains = workspace.enabled_domains || {};
    const syncOnlyEnabled = workspace.rules?.sync_only_enabled_domains ?? true;

    const categories: Array<'product' | 'engineering' | 'release'> = ['product', 'engineering', 'release'];

    for (const category of categories) {
      const entries: CatalogEntry[] = catalog[category] || [];
      const enabledList: string[] = enabledDomains[category] || [];

      for (const entry of entries) {
        const relPath = entry.file;
        const fullPath = path.resolve(location.backlogDir, relPath);
        const baseName = path.basename(relPath, path.extname(relPath));
        const slugWithoutNumber = baseName.replace(/^\d+-/, '');

        let isEnabled = false;
        if (enabledList.length > 0) {
          isEnabled =
            enabledList.includes(baseName) ||
            enabledList.includes(slugWithoutNumber) ||
            enabledList.includes(entry.id.toLowerCase()) ||
            enabledList.includes(entry.id);
        } else if (!syncOnlyEnabled) {
          isEnabled = true;
        }

        if (syncOnlyEnabled && !isEnabled) {
          continue;
        }

        if (!fs.existsSync(fullPath)) {
          parseErrors.push({
            type: 'SCHEMA',
            code: 'FILE_NOT_FOUND',
            message: `Catalog file not found for domain "${entry.id}" (${slugWithoutNumber}): ${relPath}`,
            filePath: fullPath,
            severity: 'error',
          });
          continue;
        }

        const fileParseRes = readYamlFile(fullPath);
        if (fileParseRes.error) {
          parseErrors.push(fileParseRes.error);
          continue;
        }

        const raw = fileParseRes.data || {};
        const domainFile: DomainFile = {
          filePath: fullPath,
          domainCategory: category,
          domainName: slugWithoutNumber,
          rawYaml: raw,
        };

        if (raw.epic) {
          const epic: Epic = {
            id: raw.epic.id,
            title: raw.epic.title,
            type: raw.epic.type || category,
            milestone: raw.epic.milestone,
            objective: raw.objective,
            dependencies: raw.dependencies || [],
            features: [],
            filePath: fullPath,
          };

          const rawFeatures = raw.features || [];
          for (const rawFeat of rawFeatures) {
            const feature: Feature = {
              id: rawFeat.id,
              title: rawFeat.title,
              priority: rawFeat.priority,
              issues: [],
              epicId: epic.id,
              filePath: fullPath,
            };

            const rawIssues = rawFeat.issues || [];
            for (const rawIss of rawIssues) {
              const issue: Issue = {
                id: rawIss.id,
                title: rawIss.title,
                type: rawIss.type || 'task',
                priority: rawIss.priority || feature.priority || 'P1',
                estimate: rawIss.estimate,
                dependencies: rawIss.dependencies || [],
                labels: rawIss.labels || [],
                acceptance_criteria: rawIss.acceptance_criteria || [],
                definition_of_done: rawIss.definition_of_done || [],
                lifecycle: rawIss.lifecycle,
                implementation: rawIss.implementation,
                milestone: rawIss.milestone || epic.milestone,
                featureId: feature.id,
                epicId: epic.id,
                filePath: fullPath,
              };

              feature.issues.push(issue);
              model.issues.push(issue);
              if (!model.issuesById.has(issue.id)) {
                model.issuesById.set(issue.id, issue);
              }
            }

            epic.features.push(feature);
            model.features.push(feature);
            if (!model.featuresById.has(feature.id)) {
              model.featuresById.set(feature.id, feature);
            }
          }

          domainFile.epic = epic;
          model.epics.push(epic);
          if (!model.epicsById.has(epic.id)) {
            model.epicsById.set(epic.id, epic);
          }
        }

        model.domainFiles.push(domainFile);
      }
    }

    return model;
  }
}
