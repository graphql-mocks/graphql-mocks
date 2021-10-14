"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const load_schema_1 = require("../../lib/schema/load-schema");
const info_1 = require("./info");
class SchemaValidate extends core_1.Command {
    async run() {
        const { flags } = await this.parse(SchemaValidate);
        let schemaPath;
        try {
            schemaPath = info_1.findSchema(flags['schema-file']);
        }
        catch (e) {
            this.error(e);
        }
        const { errors } = load_schema_1.loadSchema(schemaPath);
        if (errors.length === 0) {
            this.log('✅ Schema is valid.');
        }
        else {
            const errorList = errors.map((e) => {
                return `  * ${e.message}`;
            });
            this.error(`❌ Invalid schema.\n\nErrors:\n${errorList}`);
        }
    }
}
exports.default = SchemaValidate;
SchemaValidate.description = 'display info about a gqlmocks config file';
SchemaValidate.flags = {
    ['schema-file']: core_1.Flags.string(),
};
