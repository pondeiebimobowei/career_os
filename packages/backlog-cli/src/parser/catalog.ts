import fs from 'node:fs';
import path from 'node:path';
import { parseYamlFile } from './yaml.js';
import { locateBacklogRoot, loadWorkspaceAndReadme } from './workspace.js';
import {
  BacklogModel,
  DomainFile,
  Epic,
  Feature,
  Issue,
  ValidationError,
  CatalogEntry,
} from './types.js';

export function parseBacklog(startDir: string = process.cwd()): BacklogModel {
  const parseErrors: ValidationError[] = [];

  const location = locateBacklogRoot(startDir);
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
          message: 'Could not locate backlog directory with README.yaml and 99-workspace.yaml',
          severity: 'error',
        },
      ],
    };
  }

  const { readme, workspace, errors } = loadWorkspaceAndReadme(location);
  parseErrors.push(...errors);

  const model: BacklogModel = {
    workspace: workspace || { name: 'CareerOS' },
    readme: readme || {},
    epics: [],
    features: [],
    issues: [],
    issuesById: new Map(),
    featuresById: new Map(),
    epicsById: new Map(),
    domainFiles: [],
    parseErrors,
  };

  if (!readme && !workspace) {
    return model;
  }

  const catalog = readme?.catalog || {};
  const enabledDomains = workspace?.enabled_domains || {};
  const syncOnlyEnabled = workspace?.rules?.sync_only_enabled_domains ?? true;

  const categories: Array<'product' | 'engineering' | 'release'> = ['product', 'engineering', 'release'];

  for (const category of categories) {
    const entries: CatalogEntry[] = catalog[category] || [];
    const enabledList: string[] = enabledDomains[category] || [];

    for (const entry of entries) {
      const relPath = entry.file;
      const fullPath = path.resolve(location.backlogDir, relPath);

      // e.g. "product/00-foundation.yaml" -> baseName "00-foundation"
      const baseName = path.basename(relPath, path.extname(relPath));
      // "00-foundation" -> "foundation"
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

      const fileParseRes = parseYamlFile(fullPath);
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
