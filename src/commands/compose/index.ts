import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { composeFiles, composeSettings } from '../../utils/compose';

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
      const composeFilesString = composeFiles({
        prefix: 'compose',
        filesDir: '.dems',
      });
      const composeString = composeFilesString.concat(composeSettings());

      if (options.showComposeString) console.log(composeString);
    });

  return command;
};

export default composeCommand();
