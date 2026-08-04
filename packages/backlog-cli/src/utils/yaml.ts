import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { ValidationProblem } from '../types/backlog.js';

export function readYamlFile<T = any>(filePath: string): { data: T | null; error?: ValidationProblem } {
  try {
    if (!fs.existsSync(filePath)) {
      return {
        data: null,
        error: {
          type: 'SCHEMA',
          code: 'FILE_NOT_FOUND',
          message: `File not found: ${filePath}`,
          filePath,
          severity: 'error',
        },
      };
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content) as T;
    return { data };
  } catch (err: any) {
    return {
      data: null,
      error: {
        type: 'SCHEMA',
        code: 'YAML_PARSE_ERROR',
        message: `Failed to parse YAML file ${path.basename(filePath)}: ${err.message}`,
        filePath,
        severity: 'error',
      },
    };
  }
}

export function dumpYamlContent(data: any): string {
  return yaml.dump(data, { indent: 2, lineWidth: -1, noRefs: true });
}
