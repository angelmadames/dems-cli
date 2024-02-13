import { Command } from 'commander';
import log from '../../utils/log';
import sharedOptions from '../../utils/shared-options';

export const cloneCommand = () => {
  const command = new Command();
  command
    .name('clone')
    .description(
      'Clones all configured git repositories defined in the config.yml\n' +
        "file in the root directory. Uses 'git clone' strategy.",
    )
    .addOption(sharedOptions.gitRef().makeOptionMandatory())
    .option('-c, --checkout', 'Checkout to git ref instead of clone')
    .action((options) => {});

  return command;
};

export default cloneCommand();
