import { Command } from 'commander';
import yaml from 'yaml';
import cliConfig from '../../config/cli';
import { createFile, createPath } from '../../utils/file-system';
import log from '../../utils/log';

export const configCLICommand = () => {
  const command = new Command();
  command
    .name('cli')
    .summary('Manage DEMS CLI config')
    .description('Manage the DEMS CLI config')
    .option('-g, --generate', 'Generate CLI config file')
    .action((options) => {
      if (options.generate) {
        createPath(cliConfig.root);
        createFile(cliConfig.file, yaml.stringify(cliConfig));
        createFile(cliConfig.currentProjectFile, cliConfig.currentProject);
      } else {
        log.info(yaml.stringify(cliConfig));
      }
    });

  return command;
};

export default configCLICommand();
