import { Command } from 'commander';
import CLIConfig from '../../config/cli.config';

export function viewConfigCommand() {
  return new Command()
    .name('view')
    .alias('get')
    .summary('Shows the DEMS config file ')
    .action(() => {
      console.log(JSON.parse(CLIConfig.get().toString()));
    });
}
