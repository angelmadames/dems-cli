import { Command } from 'commander';
import CLIConfig from '../../config/cli.config';

export function generateConfigCommand() {
  return new Command()
    .name('generate')
    .alias('create')
    .summary('Generates default DEMS config file')
    .action(() => {
      CLIConfig.generate();
    });
}
