import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { noIndent } from '../../utils/string';
import { cleanDepsCommand } from './deps';
import { cleanDotEnvCommand } from './dot-env';
import { cleanReposCommand } from './repos';

export const cleanCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('clean')
    .summary('Cleanup DEMS-managed resources')
    .description(
      noIndent(`
        Cleans all configured resources and services initialized
        by DEMS. Resets your local development environment.
      `),
    )
    .addCommand(cleanDepsCommand())
    .addCommand(cleanDotEnvCommand())
    .addCommand(cleanReposCommand());

  return command;
};

export default cleanCommand();
