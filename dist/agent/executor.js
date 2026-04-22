"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolExecutor = void 0;
const fileTools_1 = require("../tools/fileTools");
const searchTools_1 = require("../tools/searchTools");
const execTools_1 = require("../tools/execTools");
const logger_1 = require("../utils/logger");
class ToolExecutor {
    async execute(name, args) {
        try {
            logger_1.logger.tool(`Executing ${name} with args: ${JSON.stringify(args)}`);
            let result;
            switch (name) {
                case 'list_files':
                    result = await (0, fileTools_1.list_files)(args.directory);
                    break;
                case 'read_file':
                    result = await (0, fileTools_1.read_file)(args.path);
                    break;
                case 'write_file':
                    await (0, fileTools_1.write_file)(args.path, args.content);
                    result = 'File written successfully';
                    break;
                case 'search_code':
                    result = await (0, searchTools_1.search_code)(args.dir, args.query);
                    break;
                case 'run_command':
                    const execRes = await (0, execTools_1.run_command)(args.command);
                    result = `Exit Code: ${execRes.code}\nStdout: ${execRes.stdout}\nStderr: ${execRes.stderr}`;
                    break;
                default:
                    return `Error: Tool ${name} not found`;
            }
            const strResult = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
            return strResult.length > 5000 ? strResult.substring(0, 5000) + '... [TRUNCATED]' : strResult;
        }
        catch (error) {
            logger_1.logger.error(`Error executing tool ${name}`, error);
            return `Error executing tool ${name}: ${error.message}`;
        }
    }
}
exports.ToolExecutor = ToolExecutor;
