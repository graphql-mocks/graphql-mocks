import { Command, flags } from '@oclif/command';
import loadBlueprint from '../../lib/load-blueprint';
import { cli } from 'cli-ux';
import { sync as pkgDir } from 'pkg-dir';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { parse, resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { loadConfig } from '../../lib/config/load-config';
import { isTypeScriptProject } from '../../lib/is-typescript-project';
import cwd from '../../lib/cwd';

export default class ConfigGenerate extends Command {
  static description =
    'Generate a basic gqlmocks config file\nSee more config options at www.graphql-mocks.com/docs/cli';

  static flags = {
    out: flags.string({ description: 'path to write generated config to' }),
    format: flags.string({
      options: ['ts', 'js', 'json'],
      description: 'specify the output format of the gqlmocks config',
    }),
    ['schema.path']: flags.string({ description: 'path to GraphQL schema' }),
    ['schema.format']: flags.string({ options: ['SDL', 'SDL_STRING'] }),
    ['handler.path']: flags.string(),
    force: flags.boolean({ default: false, description: 'overwrite config if one exists' }),
  };

  async run() {
    const { flags } = this.parse(ConfigGenerate);

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

    const format = flags.format ?? isTypeScriptProject(flags.out) ? 'ts' : 'js';
    let configPath;
    if (flags.out) {
      const { ext } = parse(flags.out);
      configPath = ext ? flags.out : `${flags.out}.${format}`;
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

    if (!flags.out) {
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
      const schemaPath = await cli.prompt(`Path to GraphQL Schema? (default: ${defaultz})`, { required: false });
      config.schema.path = schemaPath || defaultz;
    }

    if (!config.handler.path) {
      const defaultz = existingConfig?.handler?.path || 'graphql-mocks/handler.ts';
      const handlerPath = await cli.prompt(`Path to GraphQL Mocks Handler? (default: ${defaultz})`, {
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
        `Found the follow validation errors, fix them and verify by running:\ngqlmocks config:validate\n\nValidation Errors:\n${formattedErrors}\n`,
      );
    }

    // TODO: mkdirp path for file (same for writing config in config:generate)
    writeFileSync(configPath, configFileContents);
    this.log(`✅ Done. Wrote gqlmock config to ${configPath}`);
  }
}