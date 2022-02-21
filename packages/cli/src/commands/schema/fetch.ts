import { Command, Flags } from '@oclif/core';
import { GraphQLSchema } from 'graphql';
import { header } from '../../lib/common-flags';
import { loadConfig } from '../../lib/config/load-config';
import { collapseHeaders } from '../../lib/schema/collapse-headers';
import { createSchemaFromLocation } from '../../lib/schema/create-schema-from-location';
import { saveSchema } from '../../lib/schema/save-schema';

export default class SchemaFetch extends Command {
  static description = 'fetch and save a graphql schema locally';

  static examples = [
    '$ gqlmocks schema fetch',
    '$ gqlmocks schema fetch --force',
    '$ gqlmocks schema fetch --source "http://remote.com/schema.graphql"',
    '$ gqlmocks schema fetch --source "http://remote-gql-api.com"',
    '$ gqlmocks schema fetch --source "http://remote-gql-api.com" --header "Authorization=Bearer abc123" --header "Header=Text"',
    '$ gqlmocks schema fetch --format "SDL_STRING"',
  ];

  static flags = {
    ...header,
    ['save-schema']: Flags.string({ description: 'path of file to save schema to' }),
    force: Flags.boolean({ description: 'overwrite a schema file if one already exists', default: false }),
    format: Flags.string({
      description: 'format to save the schema as',
      options: ['SDL', 'SDL_STRING'],
      default: 'SDL',
    }),
    source: Flags.string({
      description: 'url of graphql api server or url of remote .graphql file',
      parse: async (str) => new URL(str).href,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(SchemaFetch);
    const { config } = loadConfig();

    let source = config?.schema.url ?? '';
    let out = config?.schema.path;
    let headers = config?.schema.headers ?? {};

    if (flags.source) {
      this.log(' ℹ️   Source specified via flag');
      source = flags.source;
    }

    if (flags['save-schema']) {
      this.log(' ℹ️   Out filepath specified via flag');
      out = flags['save-schema'];
    }

    if (flags.header) {
      this.log(' ℹ️   Fetch headers specified via flag');
      headers = collapseHeaders(flags.header);
    }

    if (!source) {
      this.error(
        'Could not determine a source to fetch from, either specify `--source` flag or `schema.url` property in gqlmocks config',
      );
    }

    if (!out) {
      this.error(
        'Could not determine an out filepath to save the schema to, either specify `--save-schema` flag or `schema.path` property in gqlmocks config',
      );
    }

    source = new URL(source).href;
    let schema: GraphQLSchema;

    try {
      schema = await createSchemaFromLocation(source, headers);
    } catch (e) {
      this.error(`Failed to fetch schema from ${source}, got error:\n${(e as Error).message}`);
    }

    try {
      const { savedPath } = saveSchema({ schema, out, format: flags.format as any, force: flags.force });
      this.log(`✅ Saved GraphQL Schema to ${savedPath}`);
    } catch (e) {
      this.error(`Unable to save schema:\n${(e as Error).message}`);
    }
  }
}
