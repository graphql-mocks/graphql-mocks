import { Command, Flags } from '@oclif/core';
import { loadConfig } from '../../lib/config/load-config';

export default class ConfigValidate extends Command {
  static description = 'Validate gqlmocks.config.js';

  static flags = {
    file: Flags.string({ char: 'f' }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ConfigValidate);
    const { errors } = loadConfig(flags.file);

    if (errors?.length) {
      const formattedErrors = errors.map((e) => `* ${e.message}`).join('\n');
      this.error(`Validation of config failed, fix then re-run:\n\n ${formattedErrors}`);
    } else {
      this.log('✅ gqlmocks config is valid.');
    }
  }
}
