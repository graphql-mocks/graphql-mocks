import { Command, flags } from '@oclif/command';
import { normalizeAbsolutePath } from '../../lib/normalize-absolute-path';
import { validateConfig } from '../../lib/validate-config';

export default class ConfigValidate extends Command {
  static description = 'Validate gqlmocks.config.js';

  static flags = {
    file: flags.string({ char: 'f' }),
  };

  async run(): Promise<void> {
    const { flags } = this.parse(ConfigValidate);

    let configFile;
    if (flags.file) {
      configFile = normalizeAbsolutePath(flags.file);
      if (!configFile) {
        this.error(`Could not find a file at ${flags.file}`);
      }
    } else {
      configFile = normalizeAbsolutePath('gqlmocks.config', { extensions: ['json', 'js', 'ts'] });
      if (!configFile) {
        this.error(
          `Could not locate gqlmocks.config.js file.\nDoes one exist at the project root alongside the package.json?`,
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let config = require(configFile as string);
    config = config.default ?? config;

    if (typeof config !== 'object') {
      throw new Error(`Could not import config file at ${configFile}, expected object got ${typeof config}`);
    }

    const errors = validateConfig(config);
    if (errors.length) {
      const formattedErrors = errors.map((e) => `* ${e.message}`).join('\n');
      this.error(`Validation of config failed, fix then re-run:\n ${formattedErrors}`);
    }
  }
}
