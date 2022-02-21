import { Command } from '@oclif/core';
import cwd from '../../lib/cwd';
import { loadConfig } from '../../lib/config/load-config';
import { sync as pkgDir } from 'pkg-dir';
import { heading } from '../../lib/info/heading';
import { errors as formatErrors } from '../../lib/info/errors';
import { config as configFlag } from '../../lib/common-flags';

export default class ConfigInfo extends Command {
  static description = 'display info about a gqlmocks config file';
  static examples = [`$ gqlmocks config info`, `$ gqlmocks config info --config "../gqlmocks.config.js"`];

  static flags = {
    ...configFlag,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ConfigInfo);
    const { config, errors, path } = loadConfig(flags.config);
    const formattedErrors = formatErrors(errors);
    const formattedConfig = JSON.stringify(config, null, 2);

    if (!config) {
      const checkedPath = flags.config ?? path ?? pkgDir(cwd());
      const checkedMessage = checkedPath ? `\nChecked ${checkedPath}` : '';
      this.error(
        `Could not find gqlmocks config${checkedMessage}\nCreate a gqlmocks config by running \`gqlmocks config:generate\``,
      );
    }

    this.log();
    this.log(heading('Location'));
    this.log(path);
    this.log();

    this.log(heading('Validations'));
    this.log(formattedErrors || '✅ Passed all validations.');
    this.log();

    this.log(heading('Config contents'));
    this.log(formattedConfig);
    this.log();
  }
}
