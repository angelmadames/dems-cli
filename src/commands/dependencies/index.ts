import { Command } from 'commander';
import { cleanDepsCommand } from '../clean/deps';
import { depsCopyCommand } from './copy';

export const dependenciesCommand = () => {
  const command = new Command();

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
