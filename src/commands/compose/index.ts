import { Command } from 'commander'
import { composeExec } from '../../utils/compose'
import logger from '../../utils/log'
import { noIndent } from '../../utils/string'
import { composeShowArgsCommand } from './show-args'
import { composeValidateCommand } from './validate'

export function composeCommand() {
  return new Command()
    .name('compose')
    .summary('Container orchestration via Docker Compose command for DEMS')
    .description(
      noIndent(`
        Aids in container orchestration for services in DEMS
        Uses Docker Compose under the hood (all commands are avaiable).
    `),
    )
    .addCommand(composeValidateCommand())
    .addCommand(composeShowArgsCommand())
    .argument('[composeArgs...]', 'Compose arguments to use')
    .allowUnknownOption()
    .action((composeArgs) => {
      if (composeArgs.length === 0) {
        logger.error('A Compose command needs to be specified.')
        process.exit(1)
      }

      composeExec({ command: composeArgs })
    })
}
