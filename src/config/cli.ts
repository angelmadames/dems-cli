import fs from 'node:fs';
import { homedir } from 'node:os';
import { exit } from 'node:process';
import { isFile } from '../utils/file-system';
import log from '../utils/log';

class CLIConfig {
  root: string;
  file: string;
  currentProject: string;
  currentProjectFile: string;

  constructor() {
    this.root = process.env.DEMS_CLI_ROOT ?? `${homedir()}/.dems`;
    this.file = process.env.DEMS_CLI_CONFIG_FILE ?? `${this.root}/config.json`;
    this.currentProjectFile = this.selectCurrentProjectFile();
    this.currentProject = this.selectCurrentProject();
  }

  selectCurrentProjectFile(
    currentProjectFile = `${this.root}/current-project`,
  ) {
    let selectedProjectFile = '';

    if (isFile(currentProjectFile)) {
      selectedProjectFile = currentProjectFile;
    } else {
      log.error('Current Project file could not be found. Does it exists?');
      exit(1);
    }

    return process.env.DEMS_CURRENT_PROJECT_FILE ?? selectedProjectFile;
  }

  selectCurrentProject(currentFile = this.currentProjectFile) {
    let selectedProjectByFile = '';

    if (isFile(currentFile)) {
      selectedProjectByFile = fs.readFileSync(currentFile, 'utf8');
    }

    return process.env.DEMS_CURRENT_PROJECT ?? selectedProjectByFile;
  }
}

const cliConfig = new CLIConfig();
export default cliConfig;
