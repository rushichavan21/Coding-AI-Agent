import { list_files, read_file, write_file } from '../tools/fileTools';
import { search_code } from '../tools/searchTools';
import { run_command } from '../tools/execTools';
import { logger } from '../utils/logger';

export class ToolExecutor {
  async execute(name: string, args: any): Promise<string> {
    try {
      logger.tool(`Executing ${name} with args: ${JSON.stringify(args)}`);
      let result: any;

      switch (name) {
        case 'list_files':
          result = await list_files(args.directory);
          break;
        case 'read_file':
          result = await read_file(args.path);
          break;
        case 'write_file':
          await write_file(args.path, args.content);
          result = 'File written successfully';
          break;
        case 'search_code':
          result = await search_code(args.dir, args.query);
          break;
        case 'run_command':
          const execRes = await run_command(args.command);
          result = `Exit Code: ${execRes.code}\nStdout: ${execRes.stdout}\nStderr: ${execRes.stderr}`;
          break;
        default:
          return `Error: Tool ${name} not found`;
      }

      const strResult = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      return strResult.length > 5000 ? strResult.substring(0, 5000) + '... [TRUNCATED]' : strResult;
    } catch (error: any) {
      logger.error(`Error executing tool ${name}`, error);
      return `Error executing tool ${name}: ${error.message}`;
    }
  }
}
