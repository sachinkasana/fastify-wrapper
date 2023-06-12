import * as fs from 'fs';
import * as Path from 'path';

export function readFileSync(path: string) {
  const key = Path.basename(path);
  const value = fs.readFileSync(path, 'utf8');
  return { key, value };
}

export async function walkDir(dir: any) {
  let files = await fs.promises.readdir(dir);
  files = await Promise.all(
    files.map(async (file: any) => {
      const filePath = Path.join(dir, file);
      const stats = await fs.promises.stat(filePath);
      if (stats.isDirectory()) {
        return walkDir(filePath);
      } else if (stats.isFile()) return filePath;
    }),
  );

  return files.reduce((all: any, folderContents: any) => all.concat(folderContents), []);
}
