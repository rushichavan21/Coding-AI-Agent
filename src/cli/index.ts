import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { logger } from '../utils/logger';
import { AgentController } from '../agent/controller';
import * as readline from 'readline';

// Load .env file so GROQ_API_KEY and other env vars are available
dotenv.config();

// Set up the CLI program with a name, description and version
const program = new Command();

program
  .name('dev-agent')
  .description('Developer CLI Agentic AI for understanding and modifying codebases')
  .version('1.0.0')
  .allowUnknownOption(true);


// --- ask command ---
// One-shot: ask a question about the codebase and get an answer
program
  .command('ask <question>')
  .description('Ask a question about the codebase')
  .allowUnknownOption(true)
  .action(async (question: string) => {
    try {
      const controller = new AgentController();
      await controller.runTask(`Answer the following question about the codebase: ${question}`);
    } catch (err) {
      logger.error('Failed to execute ask command', err);
      process.exit(1);
    }
  });


// --- debug command ---
// Paste in an error message or stack trace and the agent will analyze and suggest a fix
program
  .command('debug <error_message>')
  .description('Debug an error or stack trace')
  .allowUnknownOption(true)
  .action(async (errorMessage: string) => {
    try {
      const controller = new AgentController();
      await controller.runTask(`Analyze and suggest a fix for this error: ${errorMessage}`);
    } catch (err) {
      logger.error('Failed to execute debug command', err);
      process.exit(1);
    }
  });


// --- refactor command ---
// Give a natural language instruction and the agent will refactor the relevant code
program
  .command('refactor <instruction>')
  .description('Refactor code based on an instruction')
  .allowUnknownOption(true)
  .action(async (instruction: string) => {
    try {
      const controller = new AgentController();
      await controller.runTask(`Refactor the codebase according to this instruction: ${instruction}`);
    } catch (err) {
      logger.error('Failed to execute refactor command', err);
      process.exit(1);
    }
  });


// --- test command ---
// Point it at a file or module and it will generate unit tests for it
program
  .command('test <target>')
  .description('Generate unit tests for a specific file or module')
  .allowUnknownOption(true)
  .action(async (target: string) => {
    try {
      const controller = new AgentController();
      await controller.runTask(`Generate unit tests for this target: ${target}`);
    } catch (err) {
      logger.error('Failed to execute test command', err);
      process.exit(1);
    }
  });


// --- fix-build command ---
// Runs the build, reads the errors, fixes the code, and repeats until it passes
program
  .command('fix-build')
  .description('Run an agent loop to continuously attempt to fix build errors')
  .allowUnknownOption(true)
  .action(async () => {
    try {
      const controller = new AgentController();
      await controller.runTask(`Run the build command, analyze any errors, fix the code, and repeat until the build succeeds. Run a build with 'npm run build' or appropriate command.`);
    } catch (err) {
      logger.error('Failed to execute fix-build command', err);
      process.exit(1);
    }
  });


// --- chat command ---
// Interactive back-and-forth session — the agent remembers the full conversation history
program
  .command('chat')
  .description('Start an interactive chat session with the agent')
  .allowUnknownOption(true)
  .action(async () => {
    console.log('Starting interactive chat session. Type "exit" or "quit" to stop.\n');

    // Create a single controller instance so the agent keeps context across messages
    let controller: AgentController;
    try {
      controller = new AgentController();
    } catch (err) {
      logger.error('Failed to initialize agent', err);
      process.exit(1);
    }

    // Set up stdin/stdout for reading user input line by line
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Handle Ctrl+C or piped input ending gracefully
    rl.on('close', () => {
      console.log('\nSession ended.');
      process.exit(0);
    });

    // Recursively prompt the user for input after each agent response
    const askQuestion = () => {
      rl.question('\x1b[32mYou:\x1b[0m ', async (input) => {
        const trimmed = input.trim();

        // Let the user exit cleanly by typing exit or quit
        if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
          console.log('Exiting chat...');
          rl.close();
          process.exit(0);
        }

        // Skip empty input — just re-prompt
        if (trimmed) {
          try {
            await controller!.runTask(trimmed);
          } catch (err) {
            logger.error('Failed to execute task', err);
          }
        }

        console.log('');
        // Loop back and wait for the next user message
        askQuestion();
      });
    };

    askQuestion();
  });


// Hand off to commander to parse the CLI arguments and trigger the right command
program.parse(process.argv);
