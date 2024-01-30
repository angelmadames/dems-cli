import { Command } from 'commander';
import yaml from 'yaml';
import cliConfig from '../../config/cli';
import { createFile, createPath } from '../../utils/file-system';
import log from '../../utils/log';
import { currentProjectCommand } from './current-project';

export const configCommand = () => {
  const command = new Command();
  command
    .name('config')
    .option('-g, --generate', 'Generate CLI config file')
    .addCommand(currentProjectCommand())
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

export default configCommand();
