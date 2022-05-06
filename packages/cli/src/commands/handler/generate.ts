import { Command, Flags } from '@oclif/core';
import { existsSync, writeFileSync } from 'fs';
import { resolve, parse } from 'path';
import { config } from '../../lib/common-flags';
import { loadConfig } from '../../lib/config/load-config';
import { isTypeScriptProject } from '../../lib/is-typescript-project';
import loadBlueprint from '../../lib/load-blueprint';
import { normalizeAbsolutePath } from '../../lib/normalize-absolute-path';

export default class HandlerGenerate extends Command {
  static description = 'generate a graphql handler';

  static examples = [
    '$ gqlconfig handler generate',
    '$ gqlconfig handler generate --force',
    '$ gqlconfig handler generate --save-handler "path/to/gqlmocks.config.js"',
    '$ gqlconfig handler generate --format "ts"',
  ];

  static flags = {
    ...config,
    ['save-handler']: Flags.string({ description: 'path to write generated config to' }),
    force: Flags.boolean({ default: false, description: 'overwrite config if one already exists' }),
    format: Flags.string({
      options: ['ts', 'js'],
      description: 'specify the file format of the created handler file',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(HandlerGenerate);
    let format = flags.format;
    const { config, path: configPath } = loadConfig(flags.config);

    let out =
      flags['save-handler'] ??
      (configPath && config?.handler.path && resolve(parse(configPath!).dir, config!.handler.path!));

    if (!out) {
      this.error(
        'Run command within a project with a gqlmocks config with a handler.path set, or specify the path with the --save-handler flag',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    out = normalizeAbsolutePath(out, { isFile: true, allowNonExisting: true })!;

    const { dir: outDirPath } = parse(out);
    if (!existsSync(outDirPath)) {
      this.error(
        `The following path doesn't exist:\n${outDirPath}\n\nEnsure these directories exist so the handler file can be created`,
      );
    }

    if (!flags.force && existsSync(out)) {
      this.error(`Bailing, file already exists at ${out}, use --force to overwrite`);
    }

    if (!flags.format) {
      format = isTypeScriptProject(out) || config?.handler.path.endsWith('.ts') ? 'ts' : 'js';
      this.log(
        `ℹ️   Detected ${format} project, using ".${format}" for handler. Format can be specified explicitly using the --format flag`,
      );
    }

    const template = loadBlueprint(`handler.${format}`);
    const handlerFileContents = template({});
    writeFileSync(out, handlerFileContents);
    this.log(`✅ Wrote handler file`);
  }
}
