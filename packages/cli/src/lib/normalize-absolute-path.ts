import { isAbsolute, resolve } from 'path';
import { existsSync } from 'fs';
import { cwd } from 'process';
import { sync as pkgDir } from 'pkg-dir';

export function normalizeAbsolutePath(path: string, options?: { extensions?: string[] }): string | undefined {
  const pkgRoot = pkgDir(cwd());
  const paths: string[] = isAbsolute(path) ? [path] : [resolve(cwd(), path)];

  if (pkgRoot && !isAbsolute(path)) {
    paths.push(resolve(pkgRoot, path));
  }

  // also check for each previous path with each extension
  paths.forEach((path) => {
    options?.extensions?.forEach((ext) => {
      paths.push(`${path}.${ext}`);
    });
  });

  return paths.find((path) => existsSync(path));
}
