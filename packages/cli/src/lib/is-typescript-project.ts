import { sync as pkgDir } from 'pkg-dir';
import { resolve } from 'path';
import cwd from './cwd';

export function isTypeScriptProject(path?: string): boolean {
  const pkgPath = pkgDir(path ?? cwd());
  if (!pkgPath) {
    return false;
  }

  let pkgJson;
  try {
    pkgJson = require(resolve(pkgPath, 'package.json'));
  } catch {
    return false;
  }

  return Boolean(pkgJson.dependencies.typescript ?? pkgJson.devDependencies.typescript ?? false);
}
