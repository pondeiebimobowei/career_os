import fs from 'node:fs';
import path from 'node:path';

export function ensureDirExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeTextFile(filePath: string, content: string): void {
  ensureDirExists(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}
