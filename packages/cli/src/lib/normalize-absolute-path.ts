import { resolve } from 'path';
import { existsSync } from 'fs';
import { cwd } from 'process';
import { sync as pkgDir } from 'pkg-dir';

export function normalizeAbsolutePath(
  path: string,
  options?: { cwd?: boolean; extensions?: string[] },
): string | undefined {
  const pkgRoot = pkgDir(cwd());
  const paths: string[] = [path];

  if (pkgRoot) {
    paths.push(resolve(pkgRoot, path));
  }

  if (options?.cwd) {
    paths.push(resolve(cwd(), path));
  }

  paths.forEach((path) => {
    options?.extensions?.forEach((ext) => {
      paths.push(`${path}.${ext}`);
    });
  });

  return paths.find((path) => existsSync(path));
}
