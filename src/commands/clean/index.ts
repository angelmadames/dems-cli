import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { deletePath } from '../../utils/file-system';
import log from '../../utils/log';
import sharedOptions from '../../utils/shared-options';

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
    .addOption(sharedOptions.force().default(false))
    .action(async (options) => {
      log.info('Cleaning DEMS-related resources...');
      if (options.force) {
        log.info('User interactivity disabled due to --force flag.');
      }

      await deletePath({ path: config.paths.repos_root, force: options.force });
      await deletePath({ path: config.paths.data, force: options.force });
      await deletePath({ path: config.paths.env_file, force: options.force });

      log.success('Clean completed for current project.');
    });

  return command;
};

export default cleanCommand();
