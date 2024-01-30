import { Command } from 'commander';
import { configCLICommand } from './cli';
import { currentProjectCommand } from './current-project';

export const configCommand = () => {
  const command = new Command();
  command
    .name('config')
    .option('-c, --create', 'Create initial config file', false)
    .addCommand(configCLICommand())
    .addCommand(currentProjectCommand())
    .action((options) => {
      console.log(`Generate config file set to: ${options.generate}`);
    });

  return command;
};

export default configCommand();
