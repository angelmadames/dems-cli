import { Command } from 'commander';
import CLIConfig from '../../config/cli.config';
import logger from '../../utils/log';

export function activeProjectCommand() {
  return new Command()
    .name('active')
    .alias('current')
    .summary('Manages the current active project')
    .action(() => {
      logger.info(`Active project is: ${CLIConfig.activeProject()}.`);
    });
}
