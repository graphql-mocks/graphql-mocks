import { Command } from '@oclif/core';
import { schema } from '../../lib/common-flags';
import { loadSchema } from '../../lib/schema/load-schema';
import { findSchema } from './info';
export default class SchemaValidate extends Command {
  static description = 'validate a graphql schema file';
  static examples = ['$ gqlmocks schema validate', '$ gqlmocks schema validate --schema "path/to/schema.graphql"'];

  static flags = {
    ...schema,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(SchemaValidate);

    let schemaPath;
    try {
      schemaPath = findSchema(flags.schema);
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

      this.error(`❌ Invalid schema.\n\nErrors:\n${errorList}`);
    }
  }
}
