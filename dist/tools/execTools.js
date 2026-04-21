"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_command = run_command;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function run_command(command, cwd = process.cwd()) {
    try {
        const { stdout, stderr } = await execAsync(command, { cwd });
        return { stdout, stderr, code: 0 };
    }
    catch (error) {
        return {
            stdout: error.stdout || '',
            stderr: error.stderr || error.message || 'Unknown error',
            code: error.code || 1
        };
    }
}
