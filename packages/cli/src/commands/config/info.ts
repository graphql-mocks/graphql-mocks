import { Command, flags } from '@oclif/command';
import chalk from 'chalk';
import cwd from '../../lib/cwd';
import { loadConfig } from '../../lib/config/load-config';
import { sync as pkgDir } from 'pkg-dir';

function heading(str: string) {
  const underline = '-'.repeat(str.length);
  return chalk.bold(chalk.blueBright(`${str}\n${underline}`));
}

export default class ConfigInfo extends Command {
  static description = 'display info about a gqlmocks config file';

  static flags = {
    config: flags.string({ char: 'c' }),
  };

  async run() {
    const { flags } = this.parse(ConfigInfo);
    const { config, errors, path } = loadConfig(flags.config);
    const formattedErrors = errors?.map((error) => ` * ${chalk.yellow(error.message)}`).join('\n');
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