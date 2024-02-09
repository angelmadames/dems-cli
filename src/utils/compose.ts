import fs from 'node:fs';
import path from 'path';

export const composeFiles = ({
  prefix = 'compose',
  filesDir = 'src/compose',
  dockerDir = '.docker',
}: {
  prefix?: string;
  filesDir?: string;
  dockerDir?: string;
} = {}): string => {
  let composeFileString = '';

  const readFilesRecursively = (currentDir: string) => {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const isDirectory = fs.statSync(filePath).isDirectory();

      if (isDirectory && file === dockerDir) {
        readFilesRecursively(filePath);
      } else if (file.match(`${prefix}.*.yml`)) {
        composeFileString += ` -f ${filePath}`;
      }
    }
  };

  readFilesRecursively(filesDir);

  return composeFileString;
};
