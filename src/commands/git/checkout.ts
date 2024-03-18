import chalk from 'chalk';
import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import git from '../../utils/git';
import sharedOptions from '../../utils/shared-options';

export const gitCheckoutCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('checkout')
    .description(
      'Checkout all configured git repositories defined in the config.json\n' +
        ', to the specified git ref.',
    )
    .addOption(sharedOptions.gitRef().default(config.git.default_ref))
    .addOption(sharedOptions.reposRoot().default(config.paths.repos_root))
    .addOption(sharedOptions.repos().default(config.repositories))
    .action((options) => {
      console.log(`Git org    > ${chalk.bold(options.gitOrg)}`);
      console.log(`Git ref    > ${chalk.bold(options.gitRef)}`);
      console.log(`Repos path > ${chalk.bold(options.reposRoot)}`);

      for (const repo of options.repos) {
        git.checkout({
          path: `${options.reposRoot}/${repo}`,
          ref: options.gitRef,
        });
      }
    });

  return command;
};

export default gitCheckoutCommand();
