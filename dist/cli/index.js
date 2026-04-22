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
const commander_1 = require("commander");
const dotenv = __importStar(require("dotenv"));
const logger_1 = require("../utils/logger");
const controller_1 = require("../agent/controller");
const readline = __importStar(require("readline"));
dotenv.config();
const program = new commander_1.Command();
program
    .name('dev-agent')
    .description('Developer CLI Agentic AI for understanding and modifying codebases')
    .version('1.0.0')
    .allowUnknownOption(true);
program
    .command('ask <question>')
    .description('Ask a question about the codebase')
    .allowUnknownOption(true)
    .action(async (question) => {
    try {
        const controller = new controller_1.AgentController();
        await controller.runTask(`Answer the following question about the codebase: ${question}`);
    }
    catch (err) {
        logger_1.logger.error('Failed to execute ask command', err);
        process.exit(1);
    }
});
program
    .command('debug <error_message>')
    .description('Debug an error or stack trace')
    .allowUnknownOption(true)
    .action(async (errorMessage) => {
    try {
        const controller = new controller_1.AgentController();
        await controller.runTask(`Analyze and suggest a fix for this error: ${errorMessage}`);
    }
    catch (err) {
        logger_1.logger.error('Failed to execute debug command', err);
        process.exit(1);
    }
});
program
    .command('refactor <instruction>')
    .description('Refactor code based on an instruction')
    .allowUnknownOption(true)
    .action(async (instruction) => {
    try {
        const controller = new controller_1.AgentController();
        await controller.runTask(`Refactor the codebase according to this instruction: ${instruction}`);
    }
    catch (err) {
        logger_1.logger.error('Failed to execute refactor command', err);
        process.exit(1);
    }
});
program
    .command('test <target>')
    .description('Generate unit tests for a specific file or module')
    .allowUnknownOption(true)
    .action(async (target) => {
    try {
        const controller = new controller_1.AgentController();
        await controller.runTask(`Generate unit tests for this target: ${target}`);
    }
    catch (err) {
        logger_1.logger.error('Failed to execute test command', err);
        process.exit(1);
    }
});
program
    .command('fix-build')
    .description('Run an agent loop to continuously attempt to fix build errors')
    .allowUnknownOption(true)
    .action(async () => {
    try {
        const controller = new controller_1.AgentController();
        await controller.runTask(`Run the build command, analyze any errors, fix the code, and repeat until the build succeeds. Run a build with 'npm run build' or appropriate command.`);
    }
    catch (err) {
        logger_1.logger.error('Failed to execute fix-build command', err);
        process.exit(1);
    }
});
program
    .command('chat')
    .description('Start an interactive chat session with the agent')
    .allowUnknownOption(true)
    .action(async () => {
    console.log('Starting interactive chat session. Type "exit" or "quit" to stop.\n');
    let controller;
    try {
        controller = new controller_1.AgentController();
    }
    catch (err) {
        logger_1.logger.error('Failed to initialize agent', err);
        process.exit(1);
    }
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('close', () => {
        console.log('\nSession ended.');
        process.exit(0);
    });
    const askQuestion = () => {
        rl.question('\x1b[32mYou:\x1b[0m ', async (input) => {
            const trimmed = input.trim();
            if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
                console.log('Exiting chat...');
                rl.close();
                process.exit(0);
            }
            if (trimmed) {
                try {
                    await controller.runTask(trimmed);
                }
                catch (err) {
                    logger_1.logger.error('Failed to execute task', err);
                }
            }
            console.log('');
            askQuestion();
        });
    };
    askQuestion();
});
program.parse(process.argv);
