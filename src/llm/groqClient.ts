import Groq from 'groq-sdk';
import { DEFAULT_MODEL, SYSTEM_PROMPT } from '../config/constants';

export class GroqClient {
  private groq: Groq;
  private model: string;

  constructor() {
    // Pull the API key from environment variables — will throw early if missing
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    this.groq = new Groq({ apiKey });

    // Allow overriding the model via env, but fall back to our default tool-use model
    this.model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  }

  // Defines all the tools the LLM is allowed to call.
  // Groq expects this in the OpenAI function-calling format.
  getTools(): Array<Groq.Chat.Completions.ChatCompletionTool> {
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

  // Sends the current conversation history to Groq and gets back the model's response.
  // The system prompt is always prepended so the LLM knows its role and rules.
  async getCompletion(messages: Groq.Chat.Completions.ChatCompletionMessageParam[]) {
    const response = await this.groq.chat.completions.create({
      model: this.model,
      messages: [
        // Inject the system prompt + current working directory so the agent knows where it is
        { role: 'system', content: SYSTEM_PROMPT + `\n\nCurrent working directory: ${process.cwd()}` },
        ...messages
      ],
      tools: this.getTools(),
      tool_choice: 'auto' // let the model decide when to use tools
    });

    return response.choices[0].message;
  }
}
