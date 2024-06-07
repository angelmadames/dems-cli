import { Command } from 'commander'
import { composeExecParams, composeFiles } from '../../utils/compose'
import logger from '../../utils/log'
import { noIndent } from '../../utils/string'

export function composeShowArgsCommand() {
  return new Command()
    .name('show-args')
    .summary('Show args for DEMS-custom Compose command')
    .description(noIndent(`
      Prints to console all the flags and arguments used for the custom
      docker compose command for DEMS.
    `))
    .action(() => {
      logger.info('Compose Command parameters:')
      logger.info(JSON.stringify(composeExecParams(), null, 2))
      logger.info('Compose Files parameters:')
      logger.info(JSON.stringify(composeFiles({ prefix: 'compose' }), null, 2))
    })
}
