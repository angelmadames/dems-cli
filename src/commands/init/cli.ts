import cliConfig from '../../config/cli';
import { createFile, createPath } from '../../utils/file-system';
import log from '../../utils/log';

export const initializeCLI = () => {
  log.info('Initializing DEMS CLI...');

  createPath({ path: cliConfig.root });
  createFile({ file: cliConfig.file, content: JSON.stringify(cliConfig) });
  createFile({
    file: cliConfig.currentProjectFile,
    content: cliConfig.currentProject,
  });
};
