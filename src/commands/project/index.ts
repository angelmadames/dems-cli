import { Command } from 'commander';
import { activeProjectCommand } from './active';
import { setActiveProjectCommand } from './set';

export function projectCommand() {
  const command = new Command()
    .name('project')
    .summary('Manage DEMS current project state')
    .description('Manage the current project state of DEMS')
    .addCommand(activeProjectCommand())
    .addCommand(setActiveProjectCommand());

  return command;
}
