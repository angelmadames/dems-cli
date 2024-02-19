import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { composeFiles, composeSettings } from '../../utils/compose';
import log from '../../utils/log';

export const composeCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('compose')
    .summary('Container orchestration command for DEMS')
    .description(
      'Aids in container orchestration for services in DEMS.\n' +
        'Uses Compose under the hood.',
    )
    .option('-z, --show-compose-string', 'Shows the Composo files string')
    .action(async (options) => {
      const args = process.argv.slice(3);
      const composeFilesString = composeFiles({
        prefix: 'compose',
        filesDir: '.dems',
      });
      const composeString = composeFilesString.concat(composeSettings());

      if (options.showComposeString) {
        console.log(composeString);
        return;
      };

      if (args.length === 0) {
        log.error('A Compose command needs to be specified.');
        process.exit(1);
      }

      console.log(args);
    });

  return command;
};

export default composeCommand();
