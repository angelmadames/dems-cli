import fs from 'node:fs';
import path from 'path';
import { projectConfig } from '../config/project';
import type { ComposeFilesParams } from './interfaces';
import { validateLocalGitRepo } from './git';

export const composeFiles = ({
  filesDir = '.dems',
  prefix = 'compose',
  repos = projectConfig().repositories,
  reposRoot = projectConfig().paths.repos_root,
}: ComposeFilesParams): string => {
  let composeFileString = '';
  const composeDirs = [];

  for (const dir of repos) {
    validateLocalGitRepo(`${reposRoot}/${dir}`);
    composeDirs.push(`${reposRoot}/${dir}/${filesDir}`);
  }

  for (const dir of composeDirs) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.match(`${prefix}*.yml`)) {
        composeFileString += `-f ${path.join(dir, file)} `;
      }
    }
  }

  return composeFileString;
};

// Execute script only if called directly
if (import.meta.path === Bun.main) {
  console.log(composeFiles({ prefix: 'compose', filesDir: '.dems' }));
}
