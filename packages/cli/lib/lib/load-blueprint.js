"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = require("path");
const Handlebars = tslib_1.__importStar(require("handlebars"));
function loadBlueprint(name) {
    const blueprintPath = path_1.resolve(__dirname, '../blueprints/', `${name}.hbs`);
    const contents = fs_1.readFileSync(blueprintPath).toString();
    if (!contents) {
        throw new Error(`Could not load blueprint from ${blueprintPath}`);
    }
    const template = Handlebars.compile(contents);
    return template;
}
exports.default = loadBlueprint;
