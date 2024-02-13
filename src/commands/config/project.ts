import fs from 'node:fs';
import { Command } from 'commander';

export const projectConfigCommand = () => {
  const command = new Command();
  command
    .name('project')
    .summary('Current project configuration')
    .description('Manage the current project config & environment variables')
    .action((options) => {});

  return command;
};

export default projectConfigCommand();
