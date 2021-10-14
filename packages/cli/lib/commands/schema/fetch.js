"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const load_config_1 = require("../../lib/config/load-config");
const collapse_headers_1 = require("../../lib/schema/collapse-headers");
const create_schema_from_location_1 = require("../../lib/schema/create-schema-from-location");
const save_schema_1 = require("../../lib/schema/save-schema");
class SchemaFetch extends core_1.Command {
    async run() {
        const { flags } = await this.parse(SchemaFetch);
        const { config } = load_config_1.loadConfig();
        let source = config?.schema.url ?? '';
        let out = config?.schema.path;
        let headers = config?.schema.headers ?? {};
        if (flags.source) {
            this.log(' ℹ️   Source specified via flag');
            source = flags.source;
        }
        if (flags['save-schema-file']) {
            this.log(' ℹ️   Out filepath specified via flag');
            out = flags['save-schema-file'];
        }
        if (flags.header) {
            this.log(' ℹ️   Fetch headers specified via flag');
            headers = collapse_headers_1.collapseHeaders(flags.header);
        }
        if (!source) {
            this.error('Could not determine a source to fetch from, either specify `--source` flag or `schema.url` property in gqlmocks config');
        }
        if (!out) {
            this.error('Could not determine an out filepath to save the schema to, either specify `--out` flag or `schema.path` property in gqlmocks config');
        }
        source = new URL(source).href;
        let schema;
        try {
            schema = await create_schema_from_location_1.createSchemaFromLocation(source, headers);
        }
        catch (e) {
            this.error(`Failed to fetch schema from ${source}, got error:\n${e.message}`);
        }
        try {
            const { savedPath } = save_schema_1.saveSchema({ schema, out, format: flags.format, force: flags.force });
            this.log(`✅ Saved GraphQL Schema to ${savedPath}`);
        }
        catch (e) {
            this.error(`Unable to save schema:\n${e.message}`);
        }
    }
}
exports.default = SchemaFetch;
SchemaFetch.description = 'Fetch and save a GraphQL Schema';
SchemaFetch.flags = {
    ['save-schema-file']: core_1.Flags.string({ description: 'path of file to save schema to' }),
    force: core_1.Flags.boolean({ default: false }),
    format: core_1.Flags.string({ options: ['SDL', 'SDL_STRING'], default: 'SDL' }),
    source: core_1.Flags.string({
        description: 'Url of GraphQL API server or url of remote .graphql file',
        parse: async (str) => new URL(str).href,
    }),
    header: core_1.Flags.string({
        multiple: true,
        description: 'specify header(s) used in request for remote schema specified by schema flag',
        dependsOn: ['source'],
    }),
};
