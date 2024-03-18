import chalk from 'chalk';
import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import git from '../../utils/git';
import sharedOptions from '../../utils/shared-options';

export const gitCloneCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('clone')
    .description(
      'Clones all configured git repositories defined in the config.json\n' +
        "file in the root directory. Uses 'git clone' strategy.",
    )
    .addOption(sharedOptions.gitRef().default(config.git.default_ref))
    .addOption(sharedOptions.reposRoot().default(config.paths.repos_root))
    .addOption(sharedOptions.gitOrg().default(config.git.org_url))
    .addOption(sharedOptions.repos().default(config.repositories))
    .action((options) => {
      console.log(`Git org    > ${chalk.bold(options.gitOrg)}`);
      console.log(`Git ref    > ${chalk.bold(options.gitRef)}`);
      console.log(`Repos path > ${chalk.bold(options.reposRoot)}`);

      for (const repo of options.repos) {
        const repoUrl = `${options.gitOrg}/${repo}`;
        git.clone({
          ref: options.gitRef,
          path: options.reposRoot,
          repo: repoUrl,
        });
      }
    });

  return command;
};

export default gitCloneCommand();
