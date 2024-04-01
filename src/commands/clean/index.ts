import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { cleanDepsCommand } from './deps';
import { cleanDotEnvCommand } from './dot-env';

export const cleanCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('clean')
    .summary('Cleanup DEMS-managed resources')
    .description(
      'Cleans all configured resources and services initialized\n' +
        'by DEMS. Resets your local development environment.',
    )
    .addCommand(cleanDepsCommand())
    .addCommand(cleanDotEnvCommand());

  return command;
};

export default cleanCommand();
