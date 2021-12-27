import { Command, flags } from '@oclif/command';

export default class SchemaInfo extends Command {
  static description = 'display info about a gqlmocks config file';

  static flags = {
    config: flags.string({ char: 'c' }),
  };

  async run() {}
}
