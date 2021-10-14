"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const fs_1 = require("fs");
const path_1 = require("path");
const load_config_1 = require("../../lib/config/load-config");
const is_typescript_project_1 = require("../../lib/is-typescript-project");
const load_blueprint_1 = tslib_1.__importDefault(require("../../lib/load-blueprint"));
const normalize_absolute_path_1 = require("../../lib/normalize-absolute-path");
class HandlerGenerate extends core_1.Command {
    async run() {
        const { flags } = await this.parse(HandlerGenerate);
        let format = flags.format;
        const { config, path: configPath } = load_config_1.loadConfig();
        let out = flags.out ?? (configPath && config?.handler.path && path_1.resolve(path_1.parse(configPath).dir, config.handler.path));
        if (!out) {
            this.error('Run command within a project with a gqlmocks config with a handler.path set, or specify the path with the --out flag');
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        out = normalize_absolute_path_1.normalizeAbsolutePath(out, { isFile: true, allowNonExisting: true });
        const { dir: outDirPath } = path_1.parse(out);
        if (!fs_1.existsSync(outDirPath)) {
            this.error(`The following path doesn't exist:\n${outDirPath}\n\nEnsure these directories exist so the handler file can be created`);
        }
        if (!flags.force && fs_1.existsSync(out)) {
            this.error(`Bailing, file already exists at ${out}, use --force to overwrite`);
        }
        if (!flags.format) {
            format = is_typescript_project_1.isTypeScriptProject(out) || config?.handler.path.endsWith('.ts') ? 'ts' : 'js';
            this.log(`ℹ️   Detected ${format} project, using ".${format}" for handler. Format can be specified explicitly using the --format flag`);
        }
        const template = load_blueprint_1.default(`handler.${format}`);
        const handlerFileContents = template({});
        fs_1.writeFileSync(out, handlerFileContents);
        this.log(`✅ Wrote handler file`);
    }
}
exports.default = HandlerGenerate;
HandlerGenerate.description = 'Generate a GraphQLHandler';
HandlerGenerate.flags = {
    out: core_1.Flags.string({ description: 'path to write generated config to' }),
    force: core_1.Flags.boolean({ default: false, description: 'overwrite config if one exists' }),
    format: core_1.Flags.string({
        options: ['ts', 'js'],
        description: 'specify the file format of the created handler file',
    }),
};
