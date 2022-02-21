import { Command } from '@oclif/core';
import { loadConfig } from '../../lib/config/load-config';
import { normalizeAbsolutePath } from '../../lib/normalize-absolute-path';
import { loadSchema } from '../../lib/schema/load-schema';
import { errors as formatErrors } from '../../lib/info/errors';
import { heading } from '../../lib/info/heading';
import { GraphQLSchema, isObjectType } from 'graphql';
import chalk from 'chalk';
import { schema } from '../../lib/common-flags';

function formatTypes(schema: GraphQLSchema): string {
  const types = Object.entries(schema.getTypeMap());
  const output: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  types.forEach(([typeName, type]) => {
    const isInternalType = typeName.startsWith('__');
    if (isObjectType(type) && !isInternalType) {
      output.push(chalk.bold(chalk.white(typeName)));
    }
  });

  return output.join('\n');
}

export function findSchema(flagPath?: string): string {
  const { config, path: configPath } = loadConfig();

  let schemaPath;
  if (flagPath) {
    schemaPath = normalizeAbsolutePath(flagPath, { isFile: true });

    if (!schemaPath) {
      throw new Error(`No schema could be found at ${flagPath}`);
    }
  } else {
    if (!config) {
      throw new Error(
        `No config file could be found, either specify a --schema flag or use command within a project with a gqlmocks config`,
      );
    }

    schemaPath = normalizeAbsolutePath(config.schema.path, { isFile: true });

    if (!schemaPath) {
      throw new Error(`Could not find a schema at ${config.schema.path} as specified in the config at ${configPath}`);
    }
  }

  return schemaPath;
}

export default class SchemaInfo extends Command {
  static description = 'display info about a GraphQL schema';
  static examples = ['$ gqlmocks schema info', '$ gqlmocks schema info --schema "path/to/schema.graphql"'];

  static flags = {
    ...schema,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(SchemaInfo);

    let schemaPath;
    try {
      schemaPath = findSchema(flags.schema);
    } catch (e) {
      this.error(e as Error);
    }

    const { schema, errors, path } = loadSchema(schemaPath);
    const formattedErrors = formatErrors(errors);

    this.log();
    this.log(heading('Location'));
    this.log(path);
    this.log();

    this.log(heading('Errors'));
    this.log(formattedErrors || '✅ No errors.');
    this.log();

    if (schema && errors.length === 0) {
      this.log(heading('Types'));
      this.log(formatTypes(schema));
      this.log();
    }
  }
}
