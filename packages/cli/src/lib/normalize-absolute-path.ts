import { resolve } from 'path';
import { existsSync } from 'fs';
import { cwd } from 'process';

export function normalizeAbsolutePath(path: string): string | null {
  if (existsSync(path)) {
    return path;
  }

  const absolutePath = resolve(cwd(), path);
  if (existsSync(absolutePath)) {
    return absolutePath;
  }

  return null;
}
