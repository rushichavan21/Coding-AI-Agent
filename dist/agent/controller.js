"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const groqClient_1 = require("../llm/groqClient");
const executor_1 = require("./executor");
const logger_1 = require("../utils/logger");
class AgentController {
    client;
    executor;
    messages;
    maxLoops = 10;
    constructor() {
        this.client = new groqClient_1.GroqClient();
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
                    const args = JSON.parse(toolCall.function.arguments);
                    const result = await this.executor.execute(functionName, args);
                    this.messages.push({
                        role: 'tool',
                        tool_call_id: toolCall.id,
                        content: result
                    });
                }
            }
            else {
                // No tool calls, agent has finished answering
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
