import chalk from 'chalk';
import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import git from '../../utils/git';
import logger from '../../utils/log';
import sharedOptions from '../../utils/shared-options';
import { noIndent } from '../../utils/string';

export const gitCloneCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('clone')
    .summary('Clones all managed repositories using the specified git ref.')
    .description(
      noIndent(`
        Clones all managed git repositories. The 'git clone' command will be
        run for each repository defined in the config.json file of the current
        project.
      `),
    )
    .addOption(sharedOptions.gitRef.default(config.git.default_ref))
    .action((options) => {
      logger.info(`Git Org    > ${chalk.bold(config.git.org_url)}`);
      logger.info(`Git Ref    > ${chalk.bold(options.gitRef)}`);
      logger.info(`Repos Path > ${chalk.bold(config.paths.repos_root)}`);

      for (const repo of config.repositories) {
        const repoUrl = `${config.git.org_url}/${repo}`;
        git.clone({
          ref: options.gitRef,
          path: config.paths.repos_root,
          repo: repoUrl,
        });
      }
    });

  return command;
};

export default gitCloneCommand();
