"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreCwd = exports.setMockCwd = void 0;
const tslib_1 = require("tslib");
const process_1 = tslib_1.__importDefault(require("process"));
let mock;
function setMockCwd(value) {
    mock = value;
}
exports.setMockCwd = setMockCwd;
function restoreCwd() {
    mock = undefined;
}
exports.restoreCwd = restoreCwd;
function cwd() {
    if (mock) {
        return mock;
    }
    return process_1.default.cwd();
}
exports.default = cwd;
