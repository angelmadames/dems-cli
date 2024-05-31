import { Command } from 'commander'
import { generateProjectConfigCommand } from './generate'
import { removeProjectCommand } from './remove'
import { viewProjectConfigCommand } from './view'

export function projectConfigCommand() {
  return new Command()
    .name('config')
    .alias('settings')
    .summary('Manages the current project configuration')
    .addCommand(viewProjectConfigCommand())
    .addCommand(generateProjectConfigCommand())
    .addCommand(removeProjectCommand())
}
