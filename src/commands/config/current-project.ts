import { Command } from 'commander';

const CurrentProjectCommand = new Command();

CurrentProjectCommand
  .name('current-project')
  .summary('Manage DEMS current project state')
  .description('Manage the current project state of DEMS')
  .option('-s, --set <project>', 'Set current project to a new value', 'dummy')
  .action((options) => {
    if (options.set) {
      console.log(`Current project was set to: ${options.set}`);
    } else {
      console.log(`Current project is: <CURRENT>`);
    }
  });

export default CurrentProjectCommand;
