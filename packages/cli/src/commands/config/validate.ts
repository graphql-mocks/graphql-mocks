import { Command, flags } from '@oclif/command';
import { loadConfig } from '../../lib/load-config';
import { normalizeAbsolutePath } from '../../lib/normalize-absolute-path';

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
          `Could not locate gqlmocks config file.\nDoes one exist at the project root alongside the package.json?`,
        );
      }
    }

    const { errors } = loadConfig(configFile);

    if (errors?.length) {
      const formattedErrors = errors.map((e) => `* ${e.message}`).join('\n');
      this.error(`Validation of config failed, fix then re-run:\n\n ${formattedErrors}`);
    } else {
      this.log('✅ gqlmocks config is valid.');
    }
  }
}
