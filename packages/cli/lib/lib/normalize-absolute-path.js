"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAbsolutePath = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const fs_1 = require("fs");
const pkg_dir_1 = require("pkg-dir");
const cwd_1 = tslib_1.__importDefault(require("./cwd"));
function normalizeAbsolutePath(path, options) {
    const extensions = [...(options?.extensions ?? []), ''];
    const isFile = options?.isFile ?? true;
    const allowNonExisting = options?.allowNonExisting ?? false;
    const pkgRoot = pkg_dir_1.sync(cwd_1.default());
    const paths = path_1.isAbsolute(path) ? [path] : [path_1.resolve(cwd_1.default(), path)];
    // return the first absolute version
    if (allowNonExisting) {
        return paths[0];
    }
    if (pkgRoot && !path_1.isAbsolute(path)) {
        paths.push(path_1.resolve(pkgRoot, path));
    }
    // also check for each previous path with each extension
    paths.forEach((path) => {
        extensions?.forEach((ext) => {
            paths.push(`${path}.${ext}`);
        });
    });
    return paths.find((path) => {
        let pathIsFile;
        try {
            pathIsFile = !fs_1.lstatSync(path).isDirectory();
        }
        catch {
            pathIsFile = false;
        }
        return isFile ? fs_1.existsSync(path) && pathIsFile : fs_1.existsSync(path) && !pathIsFile;
    });
}
exports.normalizeAbsolutePath = normalizeAbsolutePath;
