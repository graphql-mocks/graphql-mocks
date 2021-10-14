"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const load_config_1 = require("../../lib/config/load-config");
const heading_1 = require("../../lib/info/heading");
const fs_1 = require("fs");
const normalize_absolute_path_1 = require("../../lib/normalize-absolute-path");
class HandlerInfo extends core_1.Command {
    async run() {
        const { flags } = await this.parse(HandlerInfo);
        const { config } = load_config_1.loadConfig();
        const errors = [];
        let handlerPath = flags['handler-file'] ?? config?.handler?.path;
        if (!handlerPath) {
            errors.push(new Error(`Could not determine the handler path, either pass the path with the --handler-path flag or run in a project with a gqlmocks config with a handler.path entry`));
        }
        else {
            handlerPath = normalize_absolute_path_1.normalizeAbsolutePath(handlerPath, { isFile: true, allowNonExisting: false });
        }
        let handler;
        if (handlerPath && fs_1.existsSync(handlerPath)) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                handler = require(handlerPath);
            }
            catch (e) {
                errors.push(new Error(`Tried to load handler but failed with error:\n${e.message}`));
            }
        }
        else {
            errors.push(new Error(`Could not find handler at ${handlerPath}`));
        }
        if (handler && !handler.query) {
            errors.push(new Error(`Exported handler doesn't appear to be a graphql mocks GraphQLHandler instance, missing #query method.\nDouble-check that it's the default export and an instance of GraphQLHandler`));
        }
        const formattedErrors = errors
            .map((e) => {
            return `  * ${e.message}`;
        })
            .join('\n');
        if (handlerPath) {
            this.log();
            this.log(heading_1.heading('Location'));
            this.log(handlerPath);
            this.log();
        }
        this.log(heading_1.heading('Errors'));
        this.log(formattedErrors || '✅ No errors.');
        this.log();
    }
}
exports.default = HandlerInfo;
HandlerInfo.description = 'display info about a GraphQL schema';
HandlerInfo.flags = {
    ['handler-file']: core_1.Flags.string(),
};
