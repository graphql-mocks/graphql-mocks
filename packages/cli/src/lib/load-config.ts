import { Config } from '../types';
import { normalizeAbsolutePath } from './normalize-absolute-path';
import { validateConfig } from './validate-config';

export function loadConfig(): { config?: Config; errors?: Error[] } {
  debugger;
  const configFile = normalizeAbsolutePath('gqlmocks.config', { extensions: ['json', 'js', 'ts'] });

  if (!configFile) {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let config = require(configFile as string);
  config = config.default ?? config;

  const errors = validateConfig(config);
  return { config, errors };
}
