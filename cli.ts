import { Command } from 'commander';
import { configCommand } from './src/commands/config';

const cli = new Command();

cli
  .name('dems-cli')
  .description('DEMS (Development Environment Management System) CLI')
  .version('0.0.1')
  .addCommand(configCommand(), { isDefault: true })

cli.parse();
