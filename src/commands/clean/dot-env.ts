import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { deletePath } from '../../utils/file-system';
import log from '../../utils/log';
import sharedOptions from '../../utils/shared-options';

export const cleanDotEnvCommand = () => {
  const command = new Command();
  command
    .name('dot-env')
    .aliases(['env', 'dotenv'])
    .summary('Cleanup repositories dot env files (.env).')
    .description(
      'Removes the dot env files (.env) for all the DEMS-managed repositories configured.',
    )
    .addOption(sharedOptions.force())
    .action(async (options) => {
      const config = projectConfig();
      log.info('Removing dot env files for managed repositories...');

      if (options.force) {
        log.warning('User interactivity disabled due to --force flag.');
      }

      for (const repo of Object.values(config.paths.repos)) {
        await deletePath({
          path: `${repo}/.env`,
          force: options.force,
        });
      }

      log.success('dot env files (.env) removed for managed repositories.');
    });

  return command;
};

export default cleanDotEnvCommand();
