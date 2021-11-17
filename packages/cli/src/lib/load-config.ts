import { Config } from '../types';
import { normalizeAbsolutePath } from './normalize-absolute-path';
import { validateConfig } from './validate-config';

export function loadConfig(path?: string): { config?: Config; errors?: Error[] } {
  path = path ?? normalizeAbsolutePath('gqlmocks.config', { extensions: ['json', 'js', 'ts'] });

  if (!path) {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let config = require(path as string);
  config = config.default ?? config;

  const errors = validateConfig(config, path);
  return { config, errors };
}
