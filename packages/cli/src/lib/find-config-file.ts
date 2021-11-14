import { resolve } from 'path';
import { existsSync } from 'fs';
import { cwd } from 'process';
import pkgDir from 'pkg-dir';
import Debug from 'debug';

const CONFIG_FILE = 'gqlmocks.config';
const CONFIG_EXTENSIONS = ['js', 'json', 'ts'];
const debug = Debug('find-config-file');

export async function findConfigFile(): Promise<string | null> {
  const cwdFile = CONFIG_EXTENSIONS.map((extension) => {
    const cwdConfigFile = resolve(cwd(), `${CONFIG_FILE}.${extension}`);
    debug(`Checking ${cwdConfigFile}`);
    if (existsSync(cwdConfigFile)) {
      debug(`Found ${cwdConfigFile}`);
      return cwdConfigFile;
    }
  }).find(Boolean);

  if (cwdFile) {
    return cwdFile;
  }

  const pkgRoot = await pkgDir(cwd());
  const pkgRootFile = CONFIG_EXTENSIONS.map((extension) => {
    if (pkgRoot) {
      const pkgRootConfigFile = resolve(pkgRoot, `${CONFIG_FILE}.${extension}`);
      debug(`Checking ${pkgRootConfigFile}`);
      if (existsSync(pkgRootConfigFile)) {
        debug(`Found ${pkgRootConfigFile}`);
        return pkgRootConfigFile;
      }
    }
  }).find(Boolean);

  if (pkgRootFile) {
    return pkgRootFile;
  }

  debug(`Did not find a config file`);
  return null;
}
