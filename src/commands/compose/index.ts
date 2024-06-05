import { Command } from 'commander'
import { composeExec } from '../../utils/compose'
import logger from '../../utils/log'
import { composeShowArgsCommand } from './show-args'

export function composeCommand() {
  return new Command()
    .name('compose')
    .summary('Container orchestration command for DEMS')
    .description(
      'Aids in container orchestration for services in DEMS.\n' +
        'Uses Compose under the hood.',
    )
    .addCommand(composeShowArgsCommand())
    .argument('[composeArgs...]', 'Compose arguments to use')
    .allowUnknownOption()
    .action((composeArgs) => {
      if (composeArgs.length === 0) {
        logger.error('A Compose command needs to be specified.')
        process.exit(1)
      }

      composeExec({
        command: composeArgs,
      })
    })
}
