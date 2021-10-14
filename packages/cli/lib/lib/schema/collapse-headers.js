"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collapseHeaders = void 0;
function collapseHeaders(headers) {
    const collapsed = (headers ?? []).reduce((headers, flag) => {
        const [key, value] = flag.split('=');
        if (!key || !value) {
            throw new Error(`Expected a key and value header pair, got key: ${key}, value: ${value}`);
        }
        return {
            ...headers,
            [key]: value,
        };
    }, {});
    return collapsed;
}
exports.collapseHeaders = collapseHeaders;
