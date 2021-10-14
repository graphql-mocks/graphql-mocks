"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeScriptProject = void 0;
const tslib_1 = require("tslib");
const pkg_dir_1 = require("pkg-dir");
const path_1 = require("path");
const cwd_1 = tslib_1.__importDefault(require("./cwd"));
function isTypeScriptProject(path) {
    const pkgPath = pkg_dir_1.sync(path ?? cwd_1.default());
    if (!pkgPath) {
        return false;
    }
    let pkgJson;
    try {
        pkgJson = require(path_1.resolve(pkgPath, 'package.json'));
    }
    catch {
        return false;
    }
    return Boolean(pkgJson?.dependencies?.typescript ?? pkgJson?.devDependencies?.typescript ?? false);
}
exports.isTypeScriptProject = isTypeScriptProject;
