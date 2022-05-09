import { Command } from '@oclif/core';
import { config } from '../../lib/common-flags';
import { loadConfig } from '../../lib/config/load-config';

export default class ConfigValidate extends Command {
  static description = 'validate a gqlmocks config file';
  static examples = ['$ gqlmocks config validate', '$ gqlmocks config validate --config "path/to/gqlmocks.config.js"'];

  static flags = {
    ...config,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ConfigValidate);
    const { errors } = loadConfig(flags.config);

    if (errors?.length) {
      const formattedErrors = errors.map((e) => `* ${e.message}`).join('\n');
      this.error(`Validation of config failed, fix then re-run:\n\n ${formattedErrors}`);
    } else {
      this.log('✅ gqlmocks config is valid.');
    }
  }
}
