"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSchema = void 0;
const fs_1 = require("fs");
const graphql_1 = require("graphql");
const normalize_absolute_path_1 = require("../normalize-absolute-path");
function loadSchema(path) {
    const filePath = normalize_absolute_path_1.normalizeAbsolutePath(path, { isFile: true });
    const errors = [];
    if (!filePath) {
        errors.push(new Error(`Path of schema at ${path} does not exist`));
        return { errors };
    }
    let type;
    let contents;
    try {
        contents = require(filePath);
        if (typeof contents !== 'string') {
            errors.push(new Error(`Expected exported contents of ${filePath} to be a string`));
            return { errors, path: filePath };
        }
        else {
            type = 'SDL_STRING';
        }
    }
    catch {
        contents = fs_1.readFileSync(filePath).toString();
        type = 'SDL';
    }
    let schema;
    try {
        schema = graphql_1.buildSchema(contents);
    }
    catch (e) {
        errors.push(new Error(`Unable to parse schema at ${filePath}, got:\n${e.message}`));
        return { errors, path: filePath };
    }
    return { schema, type, errors, path: filePath };
}
exports.loadSchema = loadSchema;
