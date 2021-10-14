"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const load_config_1 = require("../../lib/config/load-config");
class ConfigValidate extends core_1.Command {
    async run() {
        const { flags } = await this.parse(ConfigValidate);
        const { errors } = load_config_1.loadConfig(flags.file);
        if (errors?.length) {
            const formattedErrors = errors.map((e) => `* ${e.message}`).join('\n');
            this.error(`Validation of config failed, fix then re-run:\n\n ${formattedErrors}`);
        }
        else {
            this.log('✅ gqlmocks config is valid.');
        }
    }
}
exports.default = ConfigValidate;
ConfigValidate.description = 'Validate gqlmocks.config.js';
ConfigValidate.flags = {
    file: core_1.Flags.string({ char: 'f' }),
};
