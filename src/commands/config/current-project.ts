import { Command } from 'commander';
import * as fs from 'node:fs';
import cliConfig from '../../config/cli';

export const currentProjectCommand = () => {
  const command = new Command();
  command
    .name('current-project')
    .summary('Manage DEMS current project state')
    .description('Manage the current project state of DEMS')
    .option('-s, --set <project>', 'Set current project to a new value')
    .action((options) => {
      if (options.set) {
        fs.writeFileSync(cliConfig.currentProjectFile, options.set);
        console.log(`Current project set to: ${options.set}`);
      } else {
        console.log(`Current project is: ${cliConfig.currentProject}`);
      }
    });

  return command;
};

export default currentProjectCommand();
