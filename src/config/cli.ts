import fs from 'node:fs';
import { homedir } from 'node:os';
import { isFile } from '../utils/file-system';
import type { CLIConfig } from '../utils/interfaces';
import log from '../utils/log';

const rootPath = process.env.DEMS_CLI_ROOT ?? `${homedir()}/.dems`;
const filePath = process.env.DEMS_CLI_CONFIG_FILE ?? `${rootPath}/config.json`;

export const currentProjectFile = (file = `${rootPath}/current-project`) => {
  let projectFile = '';

  if (isFile(file)) {
    projectFile = file;
  } else {
    log.error(`Project file ${file} could not be found.\nDoes it exists?`);
    throw new Error('Could not select or determine the current project file.');
  }

  return process.env.DEMS_CURRENT_PROJECT_FILE ?? projectFile;
};

export const currentProject = (currentFile = currentProjectFile()) => {
  let selectedProjectByFile = '';

  if (isFile(currentFile)) {
    selectedProjectByFile = fs.readFileSync(currentFile, 'utf8');
  }

  return process.env.DEMS_CURRENT_PROJECT ?? selectedProjectByFile;
};

const cliConfig: CLIConfig = {
  root: rootPath,
  file: filePath,
  currentProjectFile: currentProjectFile(),
  currentProject: currentProject(),
};

export default cliConfig;
