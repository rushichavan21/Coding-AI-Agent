"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const groqClient_1 = require("../llm/groqClient");
const ollamaClient_1 = require("../llm/ollamaClient");
const executor_1 = require("./executor");
const logger_1 = require("../utils/logger");
class AgentController {
    client;
    executor;
    messages;
    maxLoops = 10;
    constructor() {
        if (process.env.USE_LOCAL_LLM === 'true' || process.env.USE_LOCAL_LLM === 'yes') {
            logger_1.logger.info('Initializing Agent with local Ollama provider...');
            this.client = new ollamaClient_1.OllamaClient();
        }
        else {
            logger_1.logger.info('Initializing Agent with Groq provider...');
            this.client = new groqClient_1.GroqClient();
        }
        this.executor = new executor_1.ToolExecutor();
        this.messages = [];
    }
    async runTask(task) {
        logger_1.logger.info(`Starting task: ${task}`);
        this.messages.push({ role: 'user', content: task });
        let loops = 0;
        while (loops < this.maxLoops) {
            loops++;
            logger_1.logger.info(`Agent thinking... (Loop ${loops}/${this.maxLoops})`);
            const response = await this.client.getCompletion(this.messages);
            if (response.content) {
                logger_1.logger.agent(response.content);
            }
            this.messages.push(response);
            if (response.tool_calls && response.tool_calls.length > 0) {
                for (const toolCall of response.tool_calls) {
                    const functionName = toolCall.function.name;
                    // Ollama sdk uses args directly as an object, whereas Groq uses a JSON string
                    let args;
                    if (typeof toolCall.function.arguments === 'string') {
                        args = JSON.parse(toolCall.function.arguments);
                    }
                    else {
                        args = toolCall.function.arguments;
                    }
                    const result = await this.executor.execute(functionName, args);
                    this.messages.push({
                        role: 'tool',
                        name: functionName, // required by some LLMs
                        content: result
                    });
                }
            }
            else {
                logger_1.logger.success('Task completed.');
                break;
            }
        }
        if (loops >= this.maxLoops) {
            logger_1.logger.warn('Max loops reached. Agent stopped to prevent infinite execution.');
        }
    }
}
exports.AgentController = AgentController;
