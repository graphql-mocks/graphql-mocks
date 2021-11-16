import { Config, LoadableJavascriptFile } from '../types';
import { normalizeAbsolutePath } from './normalize-absolute-path';
import Debug from 'debug';

const debug = Debug('validate-config');

export function validateConfig(config: any): Error[] {
  const errors: Error[] = [];
  const catchError = (error: Error) => errors.push(error);

  if (typeof config !== 'object') {
    catchError(new Error(`config must be an object, got ${typeof config}`));
    return errors;
  }

  validateSchemaConfig(config, catchError);
  validateHandlerConfig(config, catchError);
  validateResolverMapConfig(config, catchError);
  validateResolverConfig(config, catchError);

  return errors;
}

export function isConfig(config: any): config is Config {
  try {
    const errors = validateConfig(config);
    return errors.length === 0;
  } catch (e) {
    return false;
  }
}

function validateLoadableJavascript(
  configKey: string | string[],
  config: Partial<Config>,
  catchError: (e: Error) => void,
) {
  if (typeof configKey === 'string') {
    configKey = [configKey];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const configEntry = configKey.reduce((config, key) => config[key], config as any) as LoadableJavascriptFile;
  debug(`Found configEntry ${JSON.stringify(configEntry)}`);

  if (!('path' in configEntry)) {
    catchError(new Error(`config.${configKey}.path is a required key`));
    return;
  }

  if (!configEntry.path) {
    catchError(new Error(`config.${configKey}.path must be a non-empty string value`));
    return;
  }

  const verifiedPath = normalizeAbsolutePath(configEntry.path, { extensions: ['js', 'ts'] });

  if (typeof verifiedPath !== 'string') {
    catchError(new Error(`Could not locate config.${configKey} at ${configEntry.path}`));
    return;
  }

  try {
    require(verifiedPath!);
  } catch (e) {
    catchError(new Error(`Unable to require file for config.${configKey} at ${verifiedPath}`));
  }
}

function validateResolverMapConfig(config: Config, catchError: (e: Error) => void) {
  if (config.resolverMap) {
    validateLoadableJavascript('resolverMap', config, catchError);
  }
}

function validateResolverConfig(config: Config, catchError: (e: Error) => void) {
  if (config.resolvers) {
    if (!config.resolvers.path) {
      catchError(new Error('config.resolvers.path is required'));
    } else {
      const resolverPath = normalizeAbsolutePath(config.resolvers.path, { extensions: [''] });
      if (!resolverPath) {
        catchError(new Error(`Unable to find directory for config.resolvers.path at ${resolverPath}`));
      }
    }

    if (!config.resolvers.organizedBy) {
      catchError(new Error('config.resolvers.organizedBy is required and currently must be set to "TYPE"'));
    }
  }
}

function validateHandlerConfig(config: Config, catchError: (e: Error) => void) {
  if (!config.handler) {
    catchError(new Error('config.handler is a required entry'));
    return;
  }

  validateLoadableJavascript('handler', config, catchError);
}

function validateSchemaConfig(config: Config, catchError: (e: Error) => void) {
  if (!config.schema) {
    catchError(new Error('config.schema is a required entry'));
    return;
  }

  if (config.schema.url) {
    if (typeof config.schema.url !== 'string') {
      catchError(new Error('config.schema.url must be a string'));
    } else {
      try {
        new URL(config.schema.url!);
      } catch {
        catchError(new Error(`Could not parse config.schema.url with value of "${config.schema.url}", is it valid?`));
      }
    }
  }

  if (config.schema.path) {
    if (!config.schema.format) {
      catchError(new Error('config.schema.format is required when config.schema.path is specified'));
      return;
    }

    const extensions: string[] = [];
    if (config.schema.format === 'JSON') {
      extensions.push('json');
    } else if (config.schema.format === 'SDL') {
      extensions.push('graphql', 'gql');
    } else if (config.schema.format === 'SDL_STRING') {
      extensions.push('js', 'ts');
    }

    const file = normalizeAbsolutePath(config.schema.path, { extensions });
    if (!file) {
      catchError(
        new Error(
          `Could not find config.schema.path ${config.schema.path}, also tried with extensions ${extensions.join(
            ', ',
          )}`,
        ),
      );
      return;
    }
  }

  const schema = config.schema;
  if (schema.url) {
    try {
      new URL(schema.url);
    } catch (e) {
      catchError(new Error(`Unable to parse schema.url:\n ${e}`));
    }
  }
}
