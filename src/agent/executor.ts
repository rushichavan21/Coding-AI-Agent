import { list_files, read_file, write_file } from '../tools/fileTools';
import { search_code } from '../tools/searchTools';
import { run_command } from '../tools/execTools';
import { logger } from '../utils/logger';

export class ToolExecutor {

  // This is called by the controller whenever the LLM decides to use a tool.
  // It maps the tool name to the actual function and runs it with the provided args.
  async execute(name: string, args: any): Promise<string> {
    try {
      logger.tool(`Executing ${name} with args: ${JSON.stringify(args)}`);

      let result: any;

      switch (name) {
        // Lists all files and folders inside a given directory
        case 'list_files':
          result = await list_files(args.directory);
          break;

        // Reads and returns the full content of a file
        case 'read_file':
          result = await read_file(args.path);
          break;

        // Writes (or overwrites) a file with the given content
        case 'write_file':
          await write_file(args.path, args.content);
          result = 'File written successfully';
          break;

        // Searches a directory for files matching a keyword or regex pattern
        case 'search_code':
          result = await search_code(args.dir, args.query);
          break;

        // Runs an arbitrary shell command and returns its output
        case 'run_command':
          const execRes = await run_command(args.command);
          result = `Exit Code: ${execRes.code}\nStdout: ${execRes.stdout}\nStderr: ${execRes.stderr}`;
          break;

        // The model hallucinated a tool that doesn't exist — return a clear error
        default:
          return `Error: Tool ${name} not found`;
      }

      // Stringify the result if it isn't already a string
      const strResult = typeof result === 'string' ? result : JSON.stringify(result, null, 2);

      // Truncate very large results so we don't blow up the context window
      return strResult.length > 5000 ? strResult.substring(0, 5000) + '... [TRUNCATED]' : strResult;

    } catch (error: any) {
      logger.error(`Error executing tool ${name}`, error);
      return `Error executing tool ${name}: ${error.message}`;
    }
  }
}
