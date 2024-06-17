import { Command } from 'commander'
import { activeProjectCommand } from './active'
import { projectConfigCommand } from './config'
import { removeProjectCommand } from './config/remove'
import { createProjectCommand } from './create'
import { setActiveProjectCommand } from './set'

export function projectCommand() {
  return new Command()
    .name('project')
    .summary('Manage DEMS current project state')
    .description('Manage the current project state of DEMS')
    .addCommand(activeProjectCommand())
    .addCommand(setActiveProjectCommand())
    .addCommand(createProjectCommand())
    .addCommand(projectConfigCommand())
    .addCommand(removeProjectCommand())
}
