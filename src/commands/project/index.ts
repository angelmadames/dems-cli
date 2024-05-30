import { Command } from 'commander'
import { activeProjectCommand } from './active'
import { projectConfigCommand } from './config'
import { removeProjectCommand } from './remove'
import { setActiveProjectCommand } from './set'

export function projectCommand() {
  const command = new Command()
    .name('project')
    .summary('Manage DEMS current project state')
    .description('Manage the current project state of DEMS')
    .addCommand(activeProjectCommand())
    .addCommand(setActiveProjectCommand())
    .addCommand(projectConfigCommand())
    .addCommand(removeProjectCommand())
  return command
}
