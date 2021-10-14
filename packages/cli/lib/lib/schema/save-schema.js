"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSchema = void 0;
const fs_1 = require("fs");
const graphql_1 = require("graphql");
const is_typescript_project_1 = require("../is-typescript-project");
const normalize_absolute_path_1 = require("../normalize-absolute-path");
function saveSchema(options) {
    const savedPath = normalize_absolute_path_1.normalizeAbsolutePath(options.out, { isFile: true, allowNonExisting: true });
    if (!savedPath) {
        throw new Error(`Could not determine an absolute path from ${options.out}`);
    }
    const printed = graphql_1.printSchema(options.schema);
    if (!options.force && fs_1.existsSync(savedPath)) {
        throw new Error(`Bailing, file already exists at ${options.out}. Re-run with \`force\` flag to overwrite.`);
    }
    let fileContents = printed;
    if (options.format === 'SDL_STRING') {
        const stringified = printed.replace(new RegExp('/`*/', 'g'), '\\`');
        const exportExpression = is_typescript_project_1.isTypeScriptProject(savedPath) ? `export default` : `module.exports =`;
        fileContents = `${exportExpression} \`
${stringified}
\`;`;
    }
    fs_1.writeFileSync(savedPath, fileContents);
    return { savedPath };
}
exports.saveSchema = saveSchema;
