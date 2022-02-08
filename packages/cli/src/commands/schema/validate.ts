import { Command, Flags } from '@oclif/core';

export default class SchemaValidate extends Command {
  static description = 'display info about a gqlmocks config file';

  static flags = {
    config: Flags.string({ char: 'c' }),
  };

  async run() {}
}
