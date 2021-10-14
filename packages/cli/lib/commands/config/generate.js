"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const load_blueprint_1 = tslib_1.__importDefault(require("../../lib/load-blueprint"));
const core_2 = require("@oclif/core");
const pkg_dir_1 = require("pkg-dir");
const os_1 = require("os");
const crypto_1 = require("crypto");
const path_1 = require("path");
const fs_1 = require("fs");
const load_config_1 = require("../../lib/config/load-config");
const is_typescript_project_1 = require("../../lib/is-typescript-project");
const cwd_1 = tslib_1.__importDefault(require("../../lib/cwd"));
class ConfigGenerate extends core_1.Command {
    async run() {
        const { flags } = await this.parse(ConfigGenerate);
        const config = {
            schema: {
                path: flags['schema.path'],
                format: flags['schema.format'],
            },
            handler: {
                path: flags['handler.path'],
            },
        };
        const root = pkg_dir_1.sync(cwd_1.default());
        const { config: existingConfig } = load_config_1.loadConfig();
        const format = flags.format ?? is_typescript_project_1.isTypeScriptProject(flags.out) ? 'ts' : 'js';
        let configPath;
        if (flags.out) {
            const { ext } = path_1.parse(flags.out);
            configPath = ext ? flags.out : `${flags.out}.${format}`;
        }
        else {
            if (!root) {
                this.error('Unable to find root package.json. Double-check command is being ran inside a js/ts project with a package.json');
            }
            configPath = path_1.resolve(root, `gqlmocks.config.${format}`);
        }
        if (!flags.force && fs_1.existsSync(configPath)) {
            this.error(`Bailing, file already exists at ${configPath}, use --force to overwrite`);
        }
        if (!flags.out) {
            this.warn(`All paths in the config are relative to:\n${root}\n`);
        }
        if (!config.schema.format) {
            const defaultz = existingConfig?.schema.format || 'SDL';
            const format = await core_2.CliUx.ux.prompt(`Format of GraphQL Schema? 'SDL' 'SDL_STRING' (default: ${defaultz})`, {
                required: false,
            });
            config.schema.format = format || defaultz;
        }
        if (!config.schema.path) {
            const defaultz = existingConfig?.schema?.path || 'graphql-mocks/schema.graphql';
            const schemaPath = await core_2.CliUx.ux.prompt(`Path to GraphQL Schema file? (default: ${defaultz})`, { required: false });
            config.schema.path = schemaPath || defaultz;
        }
        if (!config.handler.path) {
            const defaultz = existingConfig?.handler?.path || 'graphql-mocks/handler.ts';
            const handlerPath = await core_2.CliUx.ux.prompt(`Path to GraphQL Mocks Handler file? (default: ${defaultz})`, {
                required: false,
            });
            config.handler.path = handlerPath || defaultz;
        }
        if (!flags.format) {
            this.log(`ℹ️   Detected ${format} project, using ".${format}" for config. Format can be specified explicitly using the --format flag\n`);
        }
        const template = load_blueprint_1.default(`config.${format}`);
        const squashedConfig = { ...existingConfig, ...config };
        const configFileContents = template(squashedConfig);
        const tmpConfig = path_1.resolve(os_1.tmpdir(), `${crypto_1.randomBytes(16).toString('hex')}.${format}`);
        fs_1.writeFileSync(tmpConfig, configFileContents);
        const { errors } = load_config_1.loadConfig(tmpConfig);
        if (errors?.length) {
            const formattedErrors = errors.map((error) => ` * ${error.message}`).join('\n');
            this.warn(`Found the follow validation errors, fix them and verify by running:\ngqlmocks config:validate\n\nValidation Errors:\n${formattedErrors}\n`);
        }
        // TODO: mkdirp path for file (same for writing config in config:generate)
        fs_1.writeFileSync(configPath, configFileContents);
        this.log(`✅ Done. Wrote gqlmock config to ${configPath}`);
    }
}
exports.default = ConfigGenerate;
ConfigGenerate.description = 'Generate a basic gqlmocks config file\nSee more config options at www.graphql-mocks.com/docs/cli';
ConfigGenerate.flags = {
    out: core_1.Flags.string({ description: 'path to write generated config to' }),
    format: core_1.Flags.string({
        options: ['ts', 'js', 'json'],
        description: 'specify the output format of the gqlmocks config',
    }),
    ['schema.path']: core_1.Flags.string({ description: 'path to GraphQL schema' }),
    ['schema.format']: core_1.Flags.string({ options: ['SDL', 'SDL_STRING'] }),
    ['handler.path']: core_1.Flags.string(),
    force: core_1.Flags.boolean({ default: false, description: 'overwrite config if one exists' }),
};
