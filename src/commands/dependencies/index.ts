import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { cleanDepsCommand } from '../clean/deps';
import { depsCopyCommand } from './copy';

export const dependenciesCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('dependencies')
    .alias('deps')
    .summary('Manages application dependencies locally')
    .description('Allows management of applicacion dependencies')
    .addCommand(depsCopyCommand())
    .addCommand(cleanDepsCommand().name('clean'));

  return command;
};

export default dependenciesCommand();
