import { Command, Flags } from '@oclif/core';
import loadBlueprint from '../../lib/load-blueprint';
import cli from 'cli-ux';
import { sync as pkgDir } from 'pkg-dir';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { parse, resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { loadConfig } from '../../lib/config/load-config';
import { isTypeScriptProject } from '../../lib/is-typescript-project';
import cwd from '../../lib/cwd';

export default class ConfigGenerate extends Command {
  static description = 'generate or update a gqlmocks config file';

  static examples = [
    '$ gqlmocks config generate',
    '$ gqlmocks config generate --force',
    '$ gqlmocks config generate --save-config "./path/to/gqlmocks.config.js"',
    '$ gqlmocks config generate --schema.path "./graphql-mocks/schema.graphql" --schema.format "SDL_STRING"',
    '$ gqlmocks config generate --handler.path "./graphql-mocks/handler.js"',
  ];

  static flags = {
    ['save-config']: Flags.string({ description: 'path to write generated config to' }),
    format: Flags.string({
      options: ['ts', 'js', 'json'],
      description: 'specify the output format of the gqlmocks config',
    }),
    ['schema.path']: Flags.string({ description: 'path to GraphQL schema' }),
    ['schema.format']: Flags.string({ options: ['SDL', 'SDL_STRING'] }),
    ['handler.path']: Flags.string(),
    force: Flags.boolean({ default: false, description: 'overwrite config if one exists' }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ConfigGenerate);

    const config = {
      schema: {
        path: flags['schema.path'],
        format: flags['schema.format'],
      },
      handler: {
        path: flags['handler.path'],
      },
    };

    const root = pkgDir(cwd());
    const { config: existingConfig } = loadConfig();

    const format = flags.format ?? isTypeScriptProject(flags['save-config']) ? 'ts' : 'js';
    let configPath;
    if (flags['save-config']) {
      const { ext } = parse(flags['save-config']);
      configPath = ext ? flags['save-config'] : `${flags['save-config']}.${format}`;
    } else {
      if (!root) {
        this.error(
          'Unable to find root package.json. Double-check command is being ran inside a js/ts project with a package.json',
        );
      }

      configPath = resolve(root, `gqlmocks.config.${format}`);
    }

    if (!flags.force && existsSync(configPath)) {
      this.error(`Bailing, file already exists at ${configPath}, use --force to overwrite`);
    }

    if (!flags['save-config']) {
      this.warn(`All paths in the config are relative to:\n${root}\n`);
    }

    if (!config.schema.format) {
      const defaultz = existingConfig?.schema.format || 'SDL';
      const format = await cli.prompt(`Format of GraphQL Schema? 'SDL' 'SDL_STRING' (default: ${defaultz})`, {
        required: false,
      });
      config.schema.format = format || defaultz;
    }

    if (!config.schema.path) {
      const defaultz = existingConfig?.schema?.path || 'graphql-mocks/schema.graphql';
      const schemaPath = await cli.prompt(`Path to GraphQL Schema file? (default: ${defaultz})`, {
        required: false,
      });
      config.schema.path = schemaPath || defaultz;
    }

    if (!config.handler.path) {
      const defaultz = existingConfig?.handler?.path || 'graphql-mocks/handler.ts';
      const handlerPath = await cli.prompt(`Path to GraphQL Mocks Handler file? (default: ${defaultz})`, {
        required: false,
      });
      config.handler.path = handlerPath || defaultz;
    }

    if (!flags.format) {
      this.log(
        `ℹ️   Detected ${format} project, using ".${format}" for config. Format can be specified explicitly using the --format flag\n`,
      );
    }

    const template = loadBlueprint(`config.${format}`);
    const squashedConfig = { ...existingConfig, ...config };
    const configFileContents = template(squashedConfig);
    const tmpConfig = resolve(tmpdir(), `${randomBytes(16).toString('hex')}.${format}`);
    writeFileSync(tmpConfig, configFileContents);
    const { errors } = loadConfig(tmpConfig);

    if (errors?.length) {
      const formattedErrors = errors.map((error: any) => ` * ${error.message}`).join('\n');
      this.warn(
        `Found the follow validation errors, fix them and verify by running:\ngqlmocks config validate\n\nValidation Errors:\n${formattedErrors}\n`,
      );
    }

    const { dir: configDirPath } = parse(configPath);
    if (!existsSync(configDirPath)) {
      this.error(
        `The following path doesn't exist:\n${configDirPath}\n\nEnsure these directories exist so the config file can be created`,
      );
    }

    writeFileSync(configPath, configFileContents);
    this.log(`✅ Done. Wrote gqlmock config to ${configPath}`);
  }
}
