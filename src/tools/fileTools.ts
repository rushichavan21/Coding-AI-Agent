import { promises as fs } from 'fs';
import * as path from 'path';
import ignore from 'ignore';

const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build', '.next'];

async function getGitignorePatterns(dir: string): Promise<string[]> {
  try {
    const gitignorePath = path.join(dir, '.gitignore');
    const content = await fs.readFile(gitignorePath, 'utf8');
    return content.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
  } catch (error) {
    return [];
  }
}

export async function list_files(dir: string): Promise<string[]> {
  const rootDir = path.resolve(dir);
  const patterns = await getGitignorePatterns(rootDir);
  const ig = ignore().add(patterns).add(IGNORED_DIRS);

  const results: string[] = [];

  async function walk(currentPath: string) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(rootDir, fullPath);

      if (ig.ignores(relativePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        results.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return results;
}

export async function read_file(filePath: string): Promise<string> {
  const fullPath = path.resolve(filePath);
  return await fs.readFile(fullPath, 'utf8');
}

export async function write_file(filePath: string, content: string): Promise<void> {
  const fullPath = path.resolve(filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, 'utf8');
}
