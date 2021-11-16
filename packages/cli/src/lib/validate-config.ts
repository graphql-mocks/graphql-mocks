import { Config, LoadableJavascriptFile } from '../types';
import { normalizeAbsolutePath } from './normalize-absolute-path';
import { resolve } from 'path';
import Debug from 'debug';

const debug = Debug('validate-config');

export function validateConfig(config: any): Error[] {
  const errors: Error[] = [];
  const catchError = (error: Error) => errors.push(error);

  if (typeof config !== 'object') {
    catchError(new Error(`config must be an object, got ${typeof config}`));
    return errors;
  }

  if (typeof config.rootPath !== 'string') {
    catchError(new Error(`config.rootPath must be a string, got ${typeof config.rootPath}`));
    return errors;
  }

  const verifiedRootPath = normalizeAbsolutePath(config.rootPath);
  if (verifiedRootPath === null) {
    catchError(new Error(`Could not locate config.rootPath directory at ${config.rootPath}`));
    return errors;
  }

  validateSchemaConfig(config, catchError);
  validateHandlerConfig(config, catchError);
  validateResolverMapConfig(config, catchError);

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

function findAbsoluteFile(pathWithoutExtension: string, extensions: string[] = ['js', 'ts']) {
  // '' keeps file without the extension in case the path already
  // includes an extension
  return [...extensions.map((ext) => `.${ext}`), '']
    .map((extension) => `${pathWithoutExtension}${extension}`)
    .find((path) => normalizeAbsolutePath(path));
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

  if (!('relativePath' in configEntry) || !('namedExport' in configEntry)) {
    catchError(new Error(`config.${configKey}.relativePath and config.${configKey}.namedExport are required keys`));
    return;
  }

  if (!configEntry.relativePath || !configEntry.namedExport) {
    catchError(
      new Error(`config.${configKey}.relativePath and config.${configKey}.namedExport require non-empty string values`),
    );
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const combinedPath = resolve(config.rootPath!, configEntry.relativePath);
  const verifiedPath = findAbsoluteFile(combinedPath);

  if (typeof verifiedPath !== 'string') {
    catchError(new Error(`Could not locate config.${configKey} at ${configEntry.relativePath}`));
    return;
  }

  let loaded;
  try {
    loaded = require(verifiedPath!);
  } catch (e) {
    catchError(new Error(`Unable to require file for config.${configKey} at ${verifiedPath}`));
  }

  if (!loaded || !loaded[configEntry.namedExport]) {
    catchError(
      new Error(
        `Unable to find named export for config.${configKey} at ${verifiedPath} with export ${configEntry.namedExport}`,
      ),
    );
  }
}

function validateResolverMapConfig(config: Config, catchError: (e: Error) => void) {
  if (config.resolverMap) {
    validateLoadableJavascript('resolverMap', config, catchError);

    if (config.resolverMap.types) {
      validateLoadableJavascript(['resolverMap', 'types'], config, catchError);
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

  if (config.schema.url && typeof config.schema.url !== 'string') {
    catchError(new Error('config.schema.url must be a string'));
  } else {
    try {
      new URL(config.schema.url!);
    } catch {
      catchError(new Error(`Could not parse config.schema.url with value of "${config.schema.url}", is it valid?`));
    }
  }

  if (config.schema.relativePath) {
    if (!config.schema.format) {
      catchError(new Error('config.schema.format is required when config.schema.relativePath is specified'));
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

    const file = findAbsoluteFile(config.schema.relativePath, extensions);
    if (!file) {
      catchError(
        new Error(
          `Could not find config.schema.relativePath ${
            config.schema.relativePath
          }, also tried with extensions ${extensions.join(', ')}`,
        ),
      );
      return;
    }

    if (file.endsWith('.js') || file.endsWith('.ts')) {
      if (typeof config.schema.namedExport !== 'string') {
        catchError(
          new Error(
            `config.schema.relativePath that reference js or ts file require a config.schema.namedExport value`,
          ),
        );
      }
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
