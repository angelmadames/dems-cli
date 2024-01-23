import { Command } from 'commander';

const ConfigCLICommand = new Command();

ConfigCLICommand.name('cli').action(() => {
  console.log('Hello from Config CLI sub command.');
});

export default ConfigCLICommand;
