import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import git from '../../utils/git';
import sharedOptions from '../../utils/shared-options';
import { noIndent } from '../../utils/string';

export const gitCheckoutCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('checkout')
    .summary('Checkout all repositories to a specific git branch or tag.')
    .description(
      noIndent(`
        Checkout to an specific git ref (branch, tag) to all managed
        repositories. The 'git checkout' command will be run in all
        repositories defined in the config.json file of the current project.
     `),
    )
    .addOption(sharedOptions.gitRef.default(config.git.default_ref))
    .action((options) => {
      for (const repoPath of Object.values(config.paths.repos)) {
        git.checkout({
          path: repoPath,
          ref: options.gitRef,
        });
      }
    });

  return command;
};

export default gitCheckoutCommand();
