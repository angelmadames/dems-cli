import { Command } from 'commander'
import { composeExec, composeFiles } from '../../utils/compose'
import logger from '../../utils/log'

export function composeValidateCommand() {
  return new Command()
    .name('validate')
    .alias('check')
    .summary('Validates the Compose files for current repositories')
    .action(() => {
      logger.info('Compose files:')
      logger.info(JSON.stringify(composeFiles({ prefix: 'compose' }), null, 2))
      composeExec({ command: ['config'] })
      logger.info('Compose files are valid!')
    })
}
