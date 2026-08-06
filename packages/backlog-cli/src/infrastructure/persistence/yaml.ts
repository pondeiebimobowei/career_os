import fs from 'node:fs';
import { parseDocument } from 'yaml';
import { Result, ok, fail } from '../../core/result.js';
import { InfrastructureError, NotFoundError } from '../../core/errors.js';
import { Issue } from '../../types/backlog.js';
import { BacklogCache } from './cache.js';

export class YamlPersistence {
  static updateIssueInFile(
    filePath: string,
    issueId: string,
    patch: Partial<Issue>
  ): Result<void> {
    try {
      if (!fs.existsSync(filePath)) {
        return fail(new NotFoundError(`YAML file not found: ${filePath}`));
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const doc = parseDocument(fileContent);

      const featuresNode = doc.get('features') as any;
      if (!featuresNode || !featuresNode.items) {
        return fail(new InfrastructureError(`No features section found in ${filePath}`));
      }

      let issueFound = false;

      for (const feature of featuresNode.items) {
        const issuesNode = feature.get('issues') as any;
        if (issuesNode && issuesNode.items) {
          for (const issueNode of issuesNode.items) {
            if (
              issueNode.get('id') &&
              String(issueNode.get('id')).toUpperCase() === issueId.toUpperCase()
            ) {
              issueFound = true;
              for (const [key, value] of Object.entries(patch)) {
                if (value !== undefined) {
                  issueNode.set(key, value);
                }
              }
              break;
            }
          }
        }
        if (issueFound) break;
      }

      if (!issueFound) {
        return fail(new NotFoundError(`Issue ${issueId} not found in ${filePath}`));
      }

      const updatedContent = doc.toString();
      fs.writeFileSync(filePath, updatedContent, 'utf-8');

      // Update cache
      const newHash = BacklogCache.computeFileHash(filePath);
      BacklogCache.set(filePath, newHash, updatedContent);

      return ok(undefined);
    } catch (err: any) {
      return fail(new InfrastructureError(`Failed to update issue in YAML: ${err.message}`));
    }
  }
}
