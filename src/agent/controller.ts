import { GroqClient } from '../llm/groqClient';
import { ToolExecutor } from './executor';
import { logger } from '../utils/logger';

export class AgentController {
  private client: GroqClient;
  private executor: ToolExecutor;

  // Keeps the full conversation history so the LLM has context across turns
  private messages: any[];

  // Safety cap — stops the agent from looping forever if something goes wrong
  private maxLoops: number = 10;

  constructor() {
    logger.info('Initializing Agent with Groq provider...');
    this.client = new GroqClient();
    this.executor = new ToolExecutor();
    this.messages = [];
  }

  async runTask(task: string) {
    logger.info(`Starting task: ${task}`);

    // Add the user's message to the conversation history
    this.messages.push({ role: 'user', content: task });

    let loops = 0;

    // The main agentic loop — keep going until the LLM stops calling tools
    while (loops < this.maxLoops) {
      loops++;
      logger.info(`Agent thinking... (Loop ${loops}/${this.maxLoops})`);

      // Ask the LLM what to do next given the current conversation history
      const response = await this.client.getCompletion(this.messages);

      // If the model has a text response, print it out
      if (response.content) {
        logger.agent(response.content);
      }

      // Save the model's response into the conversation history
      this.messages.push(response);

      if (response.tool_calls && response.tool_calls.length > 0) {
        // The model wants to call one or more tools — run each one and feed the results back
        for (const toolCall of response.tool_calls) {
          const functionName = toolCall.function.name;

          // Groq sends arguments as a JSON string, so we parse it before passing to the executor
          const args = JSON.parse(toolCall.function.arguments);

          const result = await this.executor.execute(functionName, args);

          // Add the tool result back into the conversation so the model can see what happened.
          // tool_call_id is required by Groq — it links this result back to the specific tool call.
          this.messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            name: functionName,
            content: result
          });
        }
      } else {
        // No tool calls means the model is done — it gave us a final answer
        logger.success('Task completed.');
        break;
      }
    }

    // Warn if we hit the loop limit without the model finishing naturally
    if (loops >= this.maxLoops) {
      logger.warn('Max loops reached. Agent stopped to prevent infinite execution.');
    }
  }
}
