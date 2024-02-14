import { Command } from 'commander';
import log from '../../utils/log';
import sharedOptions from '../../utils/shared-options';
import { projectConfig, projectEnvVars } from '../../config/project';
import Git from '../../utils/git';
import chalk from 'chalk';

export const cloneCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('clone')
    .description(
      'Clones all configured git repositories defined in the config.yml\n' +
        "file in the root directory. Uses 'git clone' strategy.",
    )
    .addOption(sharedOptions.gitRef().default(config.git.default_ref))
    .option('-c, --checkout', 'Checkout to git ref instead of clone')
    .action((options) => {
      console.log(`Git org > ${chalk.bold(config.git.org_url)}`);
      console.log(`Git ref > ${chalk.bold(config.git.default_ref)}`);

      for (const repo of config.repositories) {
        const repoUrl = `${config.git.org_url}/${repo}`;
        const git = new Git({
          workingDir: config.paths.repositories_root,
          ref: options.gitRef,
          repo: repo,
        });

        if (options.checkout) {
          git.checkout({
            workingDir: `${config.paths.repositories_root}/${repo}`,
            ref: options.gitRef,
          });
        } else {
          git.clone({
            workingDir: config.paths.repositories_root,
            repo: repoUrl,
            ref: options.gitRef,
          });
        }
      }
    });

  return command;
};

export default cloneCommand();
