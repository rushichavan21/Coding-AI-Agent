import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { logger } from '../utils/logger';
import { AgentController } from '../agent/controller';
import * as readline from 'readline';

dotenv.config();

const program = new Command();

program
  .name('ai-agent')
  .description('Developer CLI Agentic AI for understanding and modifying codebases')
  .version('1.0.0');

program
  .command('ask <question>')
  .description('Ask a question about the codebase')
  .action(async (question: string) => {
    try {
      const controller = new AgentController();
      await controller.runTask(`Answer the following question about the codebase: ${question}`);
    } catch (err) {
      logger.error('Failed to execute ask command', err);
      process.exit(1);
    }
  });

program
  .command('debug <error_message>')
  .description('Debug an error or stack trace')
  .action(async (errorMessage: string) => {
    try {
      const controller = new AgentController();
      await controller.runTask(`Analyze and suggest a fix for this error: ${errorMessage}`);
    } catch (err) {
      logger.error('Failed to execute debug command', err);
      process.exit(1);
    }
  });

program
  .command('refactor <instruction>')
  .description('Refactor code based on an instruction')
  .action(async (instruction: string) => {
    try {
      const controller = new AgentController();
      await controller.runTask(`Refactor the codebase according to this instruction: ${instruction}`);
    } catch (err) {
      logger.error('Failed to execute refactor command', err);
      process.exit(1);
    }
  });

program
  .command('test <target>')
  .description('Generate unit tests for a specific file or module')
  .action(async (target: string) => {
    try {
      const controller = new AgentController();
      await controller.runTask(`Generate unit tests for this target: ${target}`);
    } catch (err) {
      logger.error('Failed to execute test command', err);
      process.exit(1);
    }
  });

program
  .command('fix-build')
  .description('Run an agent loop to continuously attempt to fix build errors')
  .action(async () => {
    try {
      const controller = new AgentController();
      await controller.runTask(`Run the build command, analyze any errors, fix the code, and repeat until the build succeeds. Run a build with 'npm run build' or appropriate command.`);
    } catch (err) {
      logger.error('Failed to execute fix-build command', err);
      process.exit(1);
    }
  });

program
  .command('chat')
  .description('Start an interactive chat session with the agent')
  .action(async () => {
    console.log('Starting interactive chat session. Type "exit" or "quit" to stop.\n');
    const controller = new AgentController();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
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
          } catch (err) {
            logger.error('Failed to execute task', err);
          }
        }
        
        console.log(''); // Empty line for readability
        askQuestion();
      });
    };

    askQuestion();  });

program.parse(process.argv);
