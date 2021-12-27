import { Command, flags } from '@oclif/command';
import { GraphQLSchema } from 'graphql';
import { loadConfig } from '../../lib/config/load-config';
import { collapseHeaders } from '../../lib/schema/collapse-headers';
import { createSchemaFromLocation } from '../../lib/schema/create-schema-from-location';
import { saveSchema } from '../../lib/schema/save-schema';

export default class SchemaFetch extends Command {
  static description = 'Fetch and save a GraphQL Schema';

  static flags = {
    out: flags.string(),
    force: flags.boolean({ default: false }),
    format: flags.string({ options: ['SDL', 'SDL_STRING'], default: 'SDL' }),
    source: flags.string({
      description: 'URL of GraphQL API server or `.graphql` file',
      parse: (str) => new URL(str).href,
    }),
    header: flags.string({
      multiple: true,
      description: 'specify header(s) used in request for remote schema specified by schema flag',
      dependsOn: ['source'],
    }),
  };

  async run() {
    const { flags } = this.parse(SchemaFetch);
    const { config } = loadConfig();

    let source = config?.schema.url ?? '';
    let out = config?.schema.path;
    let headers = config?.schema.headers ?? {};

    if (flags.source) {
      this.log(' ℹ️   Source specified via flag');
      source = flags.source;
    }

    if (flags.out) {
      this.log(' ℹ️   Out filepath specified via flag');
      out = flags.out;
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
        'Could not determine an out filepath to save the schema to, either specify `--out` flag or `schema.path` property in gqlmocks config',
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
