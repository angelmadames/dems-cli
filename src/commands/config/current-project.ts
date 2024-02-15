import fs from 'node:fs';
import { Command } from 'commander';
import cliConfig from '../../config/cli';

export const currentProjectCommand = () => {
  const command = new Command();
  command
    .name('current-project')
    .summary('Manage DEMS current project state')
    .description('Manage the current project state of DEMS')
    .option('-s, --set <project>', 'Set current project to a new value')
    .option('-f, --current-project-file', 'Set the current project file to use')
    .action((options) => {
      const currentProjectFile =
        options.currentProjectFile ?? cliConfig.currentProjectFile;
      if (options.set) {
        fs.writeFileSync(currentProjectFile, options.set);
        console.log(`Current project set to: ${options.set}`);
      } else {
        console.log(`Current project is: ${cliConfig.currentProject}`);
      }
    });

  return command;
};

export default currentProjectCommand();
