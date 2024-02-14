import { Command } from 'commander';
import yaml from 'yaml';
import cliConfig from '../../config/cli';
import { createFile, createPath } from '../../utils/file-system';
import log from '../../utils/log';
import { currentProjectCommand } from './current-project';
import { projectConfigCommand } from './project';

export const configCommand = () => {
  const command = new Command();
  command
    .name('config')
    .option('-g, --generate', 'Generate CLI config file')
    .addCommand(currentProjectCommand())
    .addCommand(projectConfigCommand())
    .action((options) => {
      if (options.generate) {
        createPath(cliConfig.root);
        createFile({
          file: cliConfig.file,
          content: yaml.stringify(cliConfig),
        });
        createFile({
          file: cliConfig.currentProjectFile,
          content: cliConfig.currentProject,
        });
      } else {
        log.info(yaml.stringify(cliConfig));
      }
    });

  return command;
};

export default configCommand();
