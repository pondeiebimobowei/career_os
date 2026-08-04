import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { ValidationError } from './types.js';

export interface ParseResult<T = any> {
  data: T | null;
  error?: ValidationError;
}

export function parseYamlFile<T = any>(filePath: string): ParseResult<T> {
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
