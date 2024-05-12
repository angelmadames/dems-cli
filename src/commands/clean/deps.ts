import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { deletePath } from '../../utils/file-system';
import log from '../../utils/log';
import sharedOptions from '../../utils/shared-options';

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
      log.info(
        'Cleaning all local dependencies for configured applications...',
      );

      if (options.force) {
        log.warning('User interactivity disabled due to --force flag.');
      }

      for (const repo of Object.values(config.paths.repos)) {
        await deletePath({
          path: `${repo}/node_modules`,
          force: options.force,
        });
      }

      log.success('Dependencies cleanup task completed.');
    });

  return command;
};

export default cleanDepsCommand();
