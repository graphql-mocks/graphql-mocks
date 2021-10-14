"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
function errors(errors) {
    return errors?.map((error) => ` * ${chalk_1.default.yellow(error.message)}`).join('\n');
}
exports.errors = errors;
