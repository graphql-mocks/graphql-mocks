import { GqlMocksConfig } from '../../types';
import { normalizeAbsolutePath } from '../normalize-absolute-path';
import { validateConfig } from './validate-config';
import { resolve } from 'path';

export function loadConfig(
  path?: string,
  options?: { strict: boolean },
): { config?: GqlMocksConfig; path?: string; errors: Error[] } {
  let filePath: string | undefined;
  const extensions = ['json', 'js', 'ts'];

  if (path) {
    filePath =
      normalizeAbsolutePath(path, { extensions }) ??
      normalizeAbsolutePath(resolve(path, 'gqlmocks.config'), { extensions });
  } else {
    filePath = normalizeAbsolutePath('gqlmocks.config', { extensions });
  }

  if (!filePath) {
    return { path: filePath, errors: [new Error(`Could not find config at ${path}`)] };
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let config = require(filePath as string);
  config = config.default ?? config;

  const errors = validateConfig(config, filePath);
  return { config, errors, path: filePath };
}
