import { Command } from 'commander';
import { projectConfig } from '../../config/project';

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
    .action(async (options) => {});

  return command;
};

export default composeCommand();
