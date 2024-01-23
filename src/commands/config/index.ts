import { Command } from 'commander';
import ConfigCLICommand from './cli';
import CurrentProjectCommand from './current-project';

const ConfigCommand = new Command();

ConfigCommand.name('config')
  .option('-g, --generate', 'Generate initial config file', false)
  .addCommand(ConfigCLICommand)
  .addCommand(CurrentProjectCommand)
  .action((options) => {
    console.log(`Generate config file set to: ${options.generate}`);
  });

export default ConfigCommand;
