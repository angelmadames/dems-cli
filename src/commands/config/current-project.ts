import * as fs from 'node:fs';
import { Command } from 'commander';
import cliConfig from '../../config/cli';

const CurrentProjectCommand = new Command();

CurrentProjectCommand.name('current-project')
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

export default CurrentProjectCommand;
