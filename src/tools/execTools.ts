import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ExecResult {
  stdout: string;
  stderr: string;
  code: number;
}

export async function run_command(command: string, cwd: string = process.cwd()): Promise<ExecResult> {
  try {
    const { stdout, stderr } = await execAsync(command, { cwd });
    return { stdout, stderr, code: 0 };
  } catch (error: any) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || error.message || 'Unknown error',
      code: error.code || 1
    };
  }
}
