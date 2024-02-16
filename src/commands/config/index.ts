import fs from 'node:fs';
import { Command } from 'commander';
import cliConfig from '../../config/cli';
import { createFile, createPath } from '../../utils/file-system';
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
          content: JSON.stringify(cliConfig, null, 2),
        });
        createFile({
          file: cliConfig.currentProjectFile,
          content: cliConfig.currentProject,
        });
      } else {
        const configContent = fs.readFileSync(cliConfig.file).toString();
        console.log(JSON.parse(configContent));
      }
    });

  return command;
};

export default configCommand();
