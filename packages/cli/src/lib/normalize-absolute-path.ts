import { isAbsolute, resolve } from 'path';
import { existsSync, lstatSync } from 'fs';
import { sync as pkgDir } from 'pkg-dir';
import cwd from './cwd';

export function normalizeAbsolutePath(
  path: string,
  options?: { isFile?: boolean; extensions?: string[]; allowNonExisting?: boolean },
): string | undefined {
  const extensions = [...(options?.extensions ?? []), ''];
  const isFile = options?.isFile ?? true;
  const allowNonExisting = options?.allowNonExisting ?? false;

  const pkgRoot = pkgDir(cwd());
  const paths: string[] = isAbsolute(path) ? [path] : [resolve(cwd(), path)];

  if (pkgRoot && !isAbsolute(path)) {
    paths.push(resolve(pkgRoot, path));
  }

  // also check for each previous path with each extension
  paths.forEach((path) => {
    extensions?.forEach((ext) => {
      paths.push(`${path}.${ext}`);
    });
  });

  return paths.find((path) => {
    let pathIsFile;

    if (allowNonExisting) {
      return true;
    }

    try {
      pathIsFile = !lstatSync(path).isDirectory();
    } catch {
      pathIsFile = false;
    }

    return isFile ? existsSync(path) && pathIsFile : existsSync(path) && !pathIsFile;
  });
}
