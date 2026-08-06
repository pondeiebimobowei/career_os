import crypto from 'node:crypto';
import fs from 'node:fs';

export class BacklogCache {
  private static hashMap = new Map<string, string>();
  private static dataCache = new Map<string, any>();

  static computeFileHash(filePath: string): string {
    if (!fs.existsSync(filePath)) return '';
    const content = fs.readFileSync(filePath, 'utf-8');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  static get<T>(key: string, currentHash: string): T | null {
    const cachedHash = this.hashMap.get(key);
    if (cachedHash && cachedHash === currentHash) {
      return this.dataCache.get(key) as T;
    }
    return null;
  }

  static set<T>(key: string, currentHash: string, data: T): void {
    this.hashMap.set(key, currentHash);
    this.dataCache.set(key, data);
  }

  static clear(): void {
    this.hashMap.clear();
    this.dataCache.clear();
  }
}
