"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqClient = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const constants_1 = require("../config/constants");
class GroqClient {
    groq;
    model;
    constructor() {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error('GROQ_API_KEY environment variable is not set');
        }
        this.groq = new groq_sdk_1.default({ apiKey });
        this.model = process.env.GROQ_MODEL || constants_1.DEFAULT_MODEL;
    }
    getTools() {
        return [
            {
                type: 'function',
                function: {
                    name: 'list_files',
                    description: 'List files and directories within a given path.',
                    parameters: {
                        type: 'object',
                        properties: {
                            directory: { type: 'string', description: 'The directory path to list' }
                        },
                        required: ['directory']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'read_file',
                    description: 'Read the content of a file.',
                    parameters: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'The path of the file to read' }
                        },
                        required: ['path']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'write_file',
                    description: 'Overwrite a file with new content.',
                    parameters: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'The path of the file to write' },
                            content: { type: 'string', description: 'The content to write to the file' }
                        },
                        required: ['path', 'content']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'search_code',
                    description: 'Search the codebase for specific keywords or patterns.',
                    parameters: {
                        type: 'object',
                        properties: {
                            dir: { type: 'string', description: 'The directory to search in' },
                            query: { type: 'string', description: 'The regex or keyword query' }
                        },
                        required: ['dir', 'query']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'run_command',
                    description: 'Run a shell command in the current directory.',
                    parameters: {
                        type: 'object',
                        properties: {
                            command: { type: 'string', description: 'The shell command to run' }
                        },
                        required: ['command']
                    }
                }
            }
        ];
    }
    async getCompletion(messages) {
        const response = await this.groq.chat.completions.create({
            model: this.model,
            messages: [
                { role: 'system', content: constants_1.SYSTEM_PROMPT + `\n\nCurrent working directory: ${process.cwd()}` },
                ...messages
            ],
            tools: this.getTools(),
            tool_choice: 'auto'
        });
        return response.choices[0].message;
    }
}
exports.GroqClient = GroqClient;
