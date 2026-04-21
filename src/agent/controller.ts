import { GroqClient } from '../llm/groqClient';
import { OllamaClient } from '../llm/ollamaClient';
import { ToolExecutor } from './executor';
import { logger } from '../utils/logger';

export class AgentController {
  private client: GroqClient | OllamaClient;
  private executor: ToolExecutor;
  private messages: any[];
  private maxLoops: number = 10;

  constructor() {
    if (process.env.USE_LOCAL_LLM === 'true' || process.env.USE_LOCAL_LLM === 'yes') {
      logger.info('Initializing Agent with local Ollama provider...');
      this.client = new OllamaClient();
    } else {
      logger.info('Initializing Agent with Groq provider...');
      this.client = new GroqClient();
    }
    this.executor = new ToolExecutor();
    this.messages = [];
  }

  async runTask(task: string) {
    logger.info(`Starting task: ${task}`);
    this.messages.push({ role: 'user', content: task });

    let loops = 0;
    while (loops < this.maxLoops) {
      loops++;
      logger.info(`Agent thinking... (Loop ${loops}/${this.maxLoops})`);
      
      const response = await this.client.getCompletion(this.messages);
      
      if (response.content) {
        logger.agent(response.content);
      }

      this.messages.push(response);

      if (response.tool_calls && response.tool_calls.length > 0) {
        for (const toolCall of response.tool_calls) {
          const functionName = toolCall.function.name;
          // Ollama sdk uses args directly as an object, whereas Groq uses a JSON string
          let args: any;
          if (typeof toolCall.function.arguments === 'string') {
            args = JSON.parse(toolCall.function.arguments);
          } else {
            args = toolCall.function.arguments;
          }
          
          const result = await this.executor.execute(functionName, args);
          
          this.messages.push({
            role: 'tool',
            name: functionName, // required by some LLMs
            content: result
          });
        }
      } else {
        logger.success('Task completed.');
        break;
      }
    }

    if (loops >= this.maxLoops) {
      logger.warn('Max loops reached. Agent stopped to prevent infinite execution.');
    }
  }
}
