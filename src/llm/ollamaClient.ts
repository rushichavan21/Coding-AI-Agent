import { Ollama, Tool, Message } from 'ollama';
import { OLLAMA_DEFAULT_MODEL, SYSTEM_PROMPT } from '../config/constants';

export class OllamaClient {
  private ollama: Ollama;
  private model: string;

  constructor() {
    this.ollama = new Ollama({ host: 'http://127.0.0.1:11434' });
    this.model = process.env.OLLAMA_MODEL || OLLAMA_DEFAULT_MODEL;
  }

  getTools(): Tool[] {
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

  async getCompletion(messages: any[]) {
    // Ollama uses similar message format to OpenAI, but we must ensure we only pass standard attributes
    const formattedMessages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT + `\n\nCurrent working directory: ${process.cwd()}` },
      ...messages.map(m => {
        const msg: any = { role: m.role, content: m.content || '' };
        if (m.tool_calls) msg.tool_calls = m.tool_calls;
        // In OpenAI, tool responses use role 'tool' and 'tool_call_id'. Ollama officially supports tool roles too.
        return msg;
      })
    ];

    const response = await this.ollama.chat({
      model: this.model,
      messages: formattedMessages,
      tools: this.getTools()
    });

    return response.message;
  }
}
