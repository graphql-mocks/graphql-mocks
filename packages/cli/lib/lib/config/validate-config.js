"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = void 0;
const tslib_1 = require("tslib");
const normalize_absolute_path_1 = require("../normalize-absolute-path");
const debug_1 = tslib_1.__importDefault(require("debug"));
const path_1 = require("path");
const pkg_dir_1 = require("pkg-dir");
const cwd_1 = tslib_1.__importDefault(require("../cwd"));
const debug = debug_1.default('validate-config');
function validateConfig(config, configPath) {
    const errors = [];
    const catchError = (error) => errors.push(error);
    if (typeof config !== 'object') {
        catchError(new Error(`config must be an object, got ${typeof config}`));
        return errors;
    }
    const root = pkg_dir_1.sync(configPath) ?? cwd_1.default();
    const validator = new Validator({ root });
    validator.validateSchemaConfig(config, catchError);
    validator.validateHandlerConfig(config, catchError);
    validator.validateResolverMapConfig(config, catchError);
    validator.validateResolverConfig(config, catchError);
    return errors;
}
exports.validateConfig = validateConfig;
class Validator {
    constructor({ root }) {
        this.root = root;
    }
    normalizePath(path, options) {
        return normalize_absolute_path_1.normalizeAbsolutePath(path_1.resolve(this.root, path), options);
    }
    validateLoadableJavascript(configKey, config, catchError) {
        if (typeof configKey === 'string') {
            configKey = [configKey];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const configEntry = configKey.reduce((config, key) => config[key], config);
        debug(`Found configEntry ${JSON.stringify(configEntry)}`);
        if (!('path' in configEntry)) {
            catchError(new Error(`config.${configKey}.path is a required key`));
            return;
        }
        if (!configEntry.path) {
            catchError(new Error(`config.${configKey}.path must be a non-empty string value`));
            return;
        }
        const verifiedPath = this.normalizePath(configEntry.path, { extensions: ['js', 'ts'] });
        if (typeof verifiedPath !== 'string') {
            catchError(new Error(`Could not locate config.${configKey} at ${configEntry.path}`));
            return;
        }
        try {
            require(verifiedPath);
        }
        catch (e) {
            catchError(new Error(`Unable to require file for config.${configKey} at ${verifiedPath}`));
        }
    }
    validateResolverMapConfig(config, catchError) {
        if (config.resolverMap) {
            this.validateLoadableJavascript('resolverMap', config, catchError);
        }
    }
    validateResolverConfig(config, catchError) {
        if (config.resolvers) {
            if (!config.resolvers.path) {
                catchError(new Error('config.resolvers.path is required'));
            }
            else {
                const resolverPath = this.normalizePath(config.resolvers.path, { extensions: [''] });
                if (!resolverPath) {
                    catchError(new Error(`Unable to find directory for config.resolvers.path at ${resolverPath}`));
                }
            }
            if (!config.resolvers.organizedBy) {
                catchError(new Error('config.resolvers.organizedBy is required and currently must be set to "TYPE"'));
            }
        }
    }
    validateHandlerConfig(config, catchError) {
        if (!config.handler) {
            catchError(new Error('config.handler is a required entry'));
            return;
        }
        this.validateLoadableJavascript('handler', config, catchError);
    }
    validateSchemaConfig(config, catchError) {
        if (!config.schema) {
            catchError(new Error('config.schema is a required entry'));
            return;
        }
        if (config.schema.url) {
            if (typeof config.schema.url !== 'string') {
                catchError(new Error('config.schema.url must be a string'));
            }
            else {
                try {
                    new URL(config.schema.url);
                }
                catch {
                    catchError(new Error(`Could not parse config.schema.url with value of "${config.schema.url}", is it a valid url?`));
                }
            }
        }
        if (config.schema.path) {
            if (!config.schema.format) {
                catchError(new Error('config.schema.format is required when config.schema.path is specified'));
                return;
            }
            const extensions = [];
            if (config.schema.format === 'SDL') {
                extensions.push('graphql', 'gql');
            }
            else if (config.schema.format === 'SDL_STRING') {
                extensions.push('js', 'ts');
            }
            const file = this.normalizePath(config.schema.path, { extensions });
            if (!file) {
                catchError(new Error(`Could not find config.schema.path ${config.schema.path}, also tried with extensions ${extensions.join(', ')}`));
                return;
            }
        }
        const schema = config.schema;
        if (schema.url) {
            try {
                new URL(schema.url);
            }
            catch (e) {
                catchError(new Error(`Unable to parse schema.url:\n ${e}`));
            }
        }
    }
}
