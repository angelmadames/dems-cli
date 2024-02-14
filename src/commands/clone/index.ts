import chalk from 'chalk';
import { Command } from 'commander';
import { projectConfig, projectEnvVars } from '../../config/project';
import Git from '../../utils/git';
import log from '../../utils/log';
import sharedOptions, {
  exitCommandIfInfoOnly,
} from '../../utils/shared-options';

export const cloneCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('clone')
    .description(
      'Clones all configured git repositories defined in the config.yml\n' +
        "file in the root directory. Uses 'git clone' strategy.",
    )
    .option('-c, --checkout', 'Checkout to git ref instead of clone')
    .addOption(sharedOptions.gitRef().default(config.git.default_ref))
    .addOption(sharedOptions.reposRoot().default(config.paths.repos_root))
    .addOption(sharedOptions.gitOrg().default(config.git.org_url))
    .addOption(sharedOptions.info())
    .action((options) => {
      console.log(`Git org    > ${chalk.bold(options.gitOrg)}`);
      console.log(`Git ref    > ${chalk.bold(options.gitRef)}`);
      console.log(`Repos path > ${chalk.bold(options.reposRoot)}`);
      exitCommandIfInfoOnly(options.info);

      for (const repo of config.repositories) {
        const repoUrl = `${options.gitOrg}/${repo}`;
        const git = new Git({
          workingDir: options.reposRoot,
          ref: options.gitRef,
          repo: repo,
        });

        if (options.checkout) {
          git.checkout({
            workingDir: `${options.reposRoot}/${repo}`,
            ref: options.gitRef,
          });
        } else {
          git.clone({
            workingDir: options.reposRoot,
            repo: repoUrl,
            ref: options.gitRef,
          });
        }
      }
    });

  return command;
};

export default cloneCommand();
