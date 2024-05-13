import cliConfig from '../../config/cli';
import { createFile, createPath } from '../../utils/file-system';
import logger from '../../utils/log';

export const initializeCLI = () => {
  logger.info('Initializing DEMS CLI...');

  createPath({ path: cliConfig.root });
  createFile({ file: cliConfig.file, content: JSON.stringify(cliConfig) });
  createFile({
    file: cliConfig.currentProjectFile,
    content: cliConfig.currentProject,
  });
};
