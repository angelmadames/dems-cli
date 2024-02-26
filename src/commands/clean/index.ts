import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { deletePath } from '../../utils/file-system';
import log from '../../utils/log';
import sharedOptions from '../../utils/shared-options';
import { cleanDepsCommand } from './deps';

export const cleanCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('clean')
    .summary('Cleanup DEMS-managed resources')
    .description(
      'Cleans all configured resources and services initialized\n' +
        'by DEMS. Resets your local development environment.',
    )
    .addCommand(cleanDepsCommand())
    .addOption(sharedOptions.force().default(false))
    .addOption(sharedOptions.reposRoot().default(config.paths.repos_root))
    .option('-e, --env-file <path>', '.env file', config.paths.repos_root)
    .action(async (options) => {
      log.info('Cleaning DEMS-related resources...');
      if (options.force) {
        log.info('User interactivity disabled due to --force flag.');
      }

      await deletePath({
        path: options.reposRoot,
        force: options.force,
      });
      await deletePath({
        path: options.envFile,
        force: options.force,
      });

      log.success('Clean completed for current project.');
    });

  return command;
};

export default cleanCommand();
