"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemaFromLocation = void 0;
const tslib_1 = require("tslib");
const normalize_absolute_path_1 = require("../normalize-absolute-path");
const core_1 = require("@oclif/core");
const serve_1 = tslib_1.__importDefault(require("../../commands/serve"));
const graphql_1 = require("graphql");
const utils_1 = require("graphql-mocks/graphql/utils");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const path_1 = require("path");
const os_1 = require("os");
function urlForPath(path) {
    try {
        return new URL(path);
    }
    catch {
        // noop
    }
}
async function createSchemaFromLocation(path, headers) {
    const axios = serve_1.default.axios;
    let normalizedPath = normalize_absolute_path_1.normalizeAbsolutePath(path, { extensions: ['gql', 'graphql', 'json', 'js', 'ts'] });
    const url = urlForPath(path);
    if (!normalizedPath && url) {
        core_1.CliUx.ux.action.start(`Fetching schema from ${url}`);
        let schemaString;
        try {
            const { data: result } = await axios.post(url.toString(), {
                query: graphql_1.getIntrospectionQuery(),
                Headers: headers,
            });
            schemaString = graphql_1.printSchema(graphql_1.buildClientSchema(result.data));
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
        if (!schemaString) {
            try {
                const { data: rawSchemaFile } = await axios.get(url.toString());
                schemaString = rawSchemaFile;
                // eslint-disable-next-line no-empty
            }
            catch { }
        }
        if (typeof schemaString !== 'string') {
            throw new Error(`Unable to get schema from ${schemaString} as a file or introspection query`);
        }
        const filename = crypto_1.randomBytes(16).toString('hex');
        normalizedPath = path_1.resolve(os_1.tmpdir(), filename);
        fs_1.writeFileSync(normalizedPath, schemaString);
        core_1.CliUx.ux.action.stop();
    }
    if (!normalizedPath) {
        throw new Error(`Could not determine a local or remote schema from ${path}`);
    }
    let schema;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const loaded = require(normalizedPath);
        schema = utils_1.createSchema(loaded?.default ?? loaded);
    }
    catch {
        const rawFile = fs_1.readFileSync(normalizedPath).toString();
        schema = utils_1.createSchema(rawFile);
    }
    return schema;
}
exports.createSchemaFromLocation = createSchemaFromLocation;
