"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (msg) => console.log(`\x1b[34m[INFO]\x1b[0m ${msg}`),
    success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
    warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
    error: (msg, err) => {
        console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
        if (err)
            console.error(err);
    },
    agent: (msg) => console.log(`\x1b[35m[AGENT]\x1b[0m ${msg}`),
    tool: (msg) => console.log(`\x1b[36m[TOOL]\x1b[0m ${msg}`)
};
