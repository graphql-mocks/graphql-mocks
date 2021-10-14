"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const cwd_1 = tslib_1.__importDefault(require("../../lib/cwd"));
const load_config_1 = require("../../lib/config/load-config");
const pkg_dir_1 = require("pkg-dir");
const heading_1 = require("../../lib/info/heading");
const errors_1 = require("../../lib/info/errors");
class ConfigInfo extends core_1.Command {
    async run() {
        const { flags } = await this.parse(ConfigInfo);
        const { config, errors, path } = load_config_1.loadConfig(flags.config);
        const formattedErrors = errors_1.errors(errors);
        const formattedConfig = JSON.stringify(config, null, 2);
        if (!config) {
            const checkedPath = flags.config ?? path ?? pkg_dir_1.sync(cwd_1.default());
            const checkedMessage = checkedPath ? `\nChecked ${checkedPath}` : '';
            this.error(`Could not find gqlmocks config${checkedMessage}\nCreate a gqlmocks config by running \`gqlmocks config:generate\``);
        }
        this.log();
        this.log(heading_1.heading('Location'));
        this.log(path);
        this.log();
        this.log(heading_1.heading('Validations'));
        this.log(formattedErrors || '✅ Passed all validations.');
        this.log();
        this.log(heading_1.heading('Config contents'));
        this.log(formattedConfig);
        this.log();
    }
}
exports.default = ConfigInfo;
ConfigInfo.description = 'display info about a gqlmocks config file';
ConfigInfo.flags = {
    config: core_1.Flags.string({ char: 'c' }),
};
