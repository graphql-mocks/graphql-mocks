"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heading = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
function heading(str) {
    const underline = '-'.repeat(str.length);
    return chalk_1.default.bold(chalk_1.default.blueBright(`${str}\n${underline}`));
}
exports.heading = heading;
