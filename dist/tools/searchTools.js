"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.search_code = search_code;
const fileTools_1 = require("./fileTools");
const path = __importStar(require("path"));
async function search_code(dir, query) {
    const allFiles = await (0, fileTools_1.list_files)(dir);
    const results = [];
    const regex = new RegExp(query, 'i');
    for (const file of allFiles) {
        try {
            const content = await (0, fileTools_1.read_file)(file);
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (regex.test(lines[i])) {
                    results.push({
                        file: path.relative(dir, file),
                        line: i + 1,
                        content: lines[i].trim()
                    });
                }
            }
        }
        catch (error) {
            // Ignore files that cannot be read (e.g. binaries)
        }
    }
    return results;
}
