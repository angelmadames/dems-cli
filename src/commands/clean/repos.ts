import chalk from 'chalk';
import { Command } from 'commander';
import cliConfig from '../../config/cli';
import { projectConfig } from '../../config/project';
import { deletePath } from '../../utils/file-system';
import logger from '../../utils/log';
import sharedOptions from '../../utils/shared-options';
import { noIndent } from '../../utils/string';

export const cleanReposCommand = () => {
  const command = new Command();
  command
    .name('repos')
    .aliases(['repositories', 'repo'])
    .summary("Remove the current project's git repositories.")
    .description(
      noIndent(`
        Removes the current project's git repositories cloned in the repository
        root path managed by DEMS. This action is irreversible.
      `),
    )
    .addOption(sharedOptions.force)
    .action(async (options) => {
      const config = projectConfig();
      logger.info("Removing the current project's git repositories...");
      logger.info(`Current project: ${chalk.bold(cliConfig.currentProject)}`);

      if (options.force) {
        logger.warn('User interactivity disabled due to --force flag.');
      }

      logger.warn('The repositories that will be removed are:');
      for (const repo of config.repositories) {
        logger.warn(`  - ${repo}`);
      }

      for (const repo of Object.values(config.paths.repos)) {
        await deletePath({
          path: repo,
          force: options.force,
        });
      }

      logger.info(
        'All managed git repositories directories have been removed.',
      );
    });

  return command;
};

export default cleanReposCommand();
