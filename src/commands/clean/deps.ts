import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { deletePath } from '../../utils/file-system';
import log from '../../utils/log';
import sharedOptions from '../../utils/shared-options';

export const cleanDepsCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('deps')
    .summary('Cleanup DEMS-managed repositories dependencies')
    .description('Cleans all repos dependencies locally installed.')
    .addOption(sharedOptions.force().default(false))
    .action(async (options) => {
      log.info(
        'Cleaning all local dependencies for configured applications...',
      );
      if (options.force) {
        log.info('User interactivity disabled due to --force flag.');
      }

      for (const repo in config.paths.repos) {
        await deletePath({
          path: `${config.paths.repos[repo]}/node_modules`,
          force: options.force,
        });
        log.success(`Dependencies clean task completed for ${repo}.`);
      }
    });

  return command;
};

export default cleanDepsCommand();
