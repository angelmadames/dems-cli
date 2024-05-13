import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { deletePath } from '../../utils/file-system';
import sharedOptions from '../../utils/shared-options';
import logger from '../../utils/log';

export const cleanDepsCommand = () => {
  const command = new Command();
  command
    .name('deps')
    .aliases(['dependencies'])
    .summary('Cleanup repositories dependencies (node_modules).')
    .description('Cleans all repos dependencies locally installed.')
    .addOption(sharedOptions.force)
    .action(async (options) => {
      const config = projectConfig();
      logger.info(
        'Cleaning all local dependencies for configured applications...',
      );

      if (options.force) {
        logger.warn('User interactivity disabled due to --force flag.');
      }

      for (const repo of Object.values(config.paths.repos)) {
        await deletePath({
          path: `${repo}/node_modules`,
          force: options.force,
        });
      }

      logger.info('Dependencies cleanup task completed.');
    });

  return command;
};

export default cleanDepsCommand();
