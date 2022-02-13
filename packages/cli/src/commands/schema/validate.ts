import { Command, Flags } from '@oclif/core';
import { loadSchema } from '../../lib/schema/load-schema';
import { findSchema } from './info';
export default class SchemaValidate extends Command {
  static description = 'display info about a gqlmocks config file';

  static flags = {
    ['schema-file']: Flags.string(),
  };

  async run() {
    const { flags } = await this.parse(SchemaValidate);

    let schemaPath;
    try {
      schemaPath = findSchema(flags['schema-file']);
    } catch (e) {
      this.error(e as Error);
    }

    const { errors } = loadSchema(schemaPath);

    if (errors.length === 0) {
      this.log('✅ Schema is valid.');
    } else {
      const errorList = errors.map((e) => {
        return `  * ${e.message}`;
      });

      this.error(`❌ Invalid schema. Errors:\n${errorList}`);
    }
  }
}
