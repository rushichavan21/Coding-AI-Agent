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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list_files = list_files;
exports.read_file = read_file;
exports.write_file = write_file;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const ignore_1 = __importDefault(require("ignore"));
const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build', '.next'];
async function getGitignorePatterns(dir) {
    try {
        const gitignorePath = path.join(dir, '.gitignore');
        const content = await fs_1.promises.readFile(gitignorePath, 'utf8');
        return content.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
    }
    catch (error) {
        return [];
    }
}
async function list_files(dir) {
    const rootDir = path.resolve(dir);
    const patterns = await getGitignorePatterns(rootDir);
    const ig = (0, ignore_1.default)().add(patterns).add(IGNORED_DIRS);
    const results = [];
    async function walk(currentPath) {
        const entries = await fs_1.promises.readdir(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            const relativePath = path.relative(rootDir, fullPath);
            if (ig.ignores(relativePath)) {
                continue;
            }
            if (entry.isDirectory()) {
                await walk(fullPath);
            }
            else {
                results.push(fullPath);
            }
        }
    }
    await walk(rootDir);
    return results;
}
async function read_file(filePath) {
    const fullPath = path.resolve(filePath);
    return await fs_1.promises.readFile(fullPath, 'utf8');
}
async function write_file(filePath, content) {
    const fullPath = path.resolve(filePath);
    await fs_1.promises.mkdir(path.dirname(fullPath), { recursive: true });
    await fs_1.promises.writeFile(fullPath, content, 'utf8');
}
