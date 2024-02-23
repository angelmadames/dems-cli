import { Command } from 'commander';
import { projectConfig } from '../../config/project';

export const dependenciesCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('dependencies')
    .alias('Install application dependencies locally')
    .summary('Updates application environment config (.env)')
    .description(
      'Uses temporary containers to install application dependencies\n' +
        'locally using bind volume mounts, which enables dependencies\n' +
        'installed to be shared between your local text editor or IDE\n' +
        'and the app container.',
    )
    .action(async (options) => {});

  return command;
};

export default dependenciesCommand();
