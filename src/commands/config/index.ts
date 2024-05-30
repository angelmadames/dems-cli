import { Command } from 'commander'
import { generateConfigCommand } from './generate'
import { viewConfigCommand } from './view'

export const configCommand = () => {
  return new Command()
    .name('config')
    .summary('Manage the DEMS configuration')
    .description(
      'Manages and displays the DEMS configuration currently in-use.',
    )
    .addCommand(viewConfigCommand())
    .addCommand(generateConfigCommand())
}

export default configCommand()
