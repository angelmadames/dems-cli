import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { composeFiles } from '../../utils/compose';

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
      if (options.showComposeString)
        console.log(composeFiles({ prefix: 'compose', filesDir: '.dems' }));
    });

  return command;
};

export default composeCommand();
