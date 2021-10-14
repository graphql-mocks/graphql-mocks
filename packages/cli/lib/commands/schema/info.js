"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSchema = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const load_config_1 = require("../../lib/config/load-config");
const normalize_absolute_path_1 = require("../../lib/normalize-absolute-path");
const load_schema_1 = require("../../lib/schema/load-schema");
const errors_1 = require("../../lib/info/errors");
const heading_1 = require("../../lib/info/heading");
const graphql_1 = require("graphql");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
function formatTypes(schema) {
    const types = Object.entries(schema.getTypeMap());
    const output = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    types.forEach(([typeName, type]) => {
        const isInternalType = typeName.startsWith('__');
        if (graphql_1.isObjectType(type) && !isInternalType) {
            output.push(chalk_1.default.bold(chalk_1.default.white(typeName)));
        }
    });
    return output.join('\n');
}
function findSchema(flagPath) {
    const { config, path: configPath } = load_config_1.loadConfig();
    let schemaPath;
    if (flagPath) {
        schemaPath = normalize_absolute_path_1.normalizeAbsolutePath(flagPath, { isFile: true });
        if (!schemaPath) {
            throw new Error(`No schema could be found at ${flagPath}`);
        }
    }
    else {
        if (!config) {
            throw new Error(`No config file could be found, either specify a --schema-file flag or use command within a project with a gqlmocks config`);
        }
        schemaPath = normalize_absolute_path_1.normalizeAbsolutePath(config.schema.path, { isFile: true });
        if (!schemaPath) {
            throw new Error(`Could not find a schema at ${config.schema.path} as specified in the config at ${configPath}`);
        }
    }
    return schemaPath;
}
exports.findSchema = findSchema;
class SchemaInfo extends core_1.Command {
    async run() {
        const { flags } = await this.parse(SchemaInfo);
        let schemaPath;
        try {
            schemaPath = findSchema(flags['schema-file']);
        }
        catch (e) {
            this.error(e);
        }
        const { schema, errors, path } = load_schema_1.loadSchema(schemaPath);
        const formattedErrors = errors_1.errors(errors);
        this.log();
        this.log(heading_1.heading('Location'));
        this.log(path);
        this.log();
        this.log(heading_1.heading('Errors'));
        this.log(formattedErrors || '✅ No errors.');
        this.log();
        if (schema && errors.length === 0) {
            this.log(heading_1.heading('Types'));
            this.log(formatTypes(schema));
            this.log();
        }
    }
}
exports.default = SchemaInfo;
SchemaInfo.description = 'display info about a GraphQL schema';
SchemaInfo.flags = {
    ['schema-file']: core_1.Flags.string(),
};
