import { list_files, read_file } from './fileTools';
import * as path from 'path';

export interface SearchResult {
  file: string;
  line: number;
  content: string;
}

export async function search_code(dir: string, query: string): Promise<SearchResult[]> {
  const allFiles = await list_files(dir);
  const results: SearchResult[] = [];
  const regex = new RegExp(query, 'i');

  for (const file of allFiles) {
    try {
      const content = await read_file(file);
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
          results.push({
            file: path.relative(dir, file),
            line: i + 1,
            content: lines[i].trim()
          });
        }
      }
    } catch (error) {
        
    }
  }

  return results;
}
