"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const normalize_absolute_path_1 = require("../normalize-absolute-path");
const validate_config_1 = require("./validate-config");
const path_1 = require("path");
function loadConfig(path, options) {
    let filePath;
    const extensions = ['json', 'js', 'ts'];
    if (path) {
        filePath =
            normalize_absolute_path_1.normalizeAbsolutePath(path, { extensions }) ??
                normalize_absolute_path_1.normalizeAbsolutePath(path_1.resolve(path, 'gqlmocks.config'), { extensions });
    }
    else {
        filePath = normalize_absolute_path_1.normalizeAbsolutePath('gqlmocks.config', { extensions });
    }
    if (!filePath) {
        return { path: filePath, errors: [new Error(`Could not find config at ${path}`)] };
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let config = require(filePath);
    config = config.default ?? config;
    const errors = validate_config_1.validateConfig(config, filePath);
    return { config, errors, path: filePath };
}
exports.loadConfig = loadConfig;
