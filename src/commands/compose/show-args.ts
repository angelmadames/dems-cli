import { Command } from 'commander'
import { composeExecParams, composeFiles } from '../../utils/compose'
import logger from '../../utils/log'

export const composeShowArgsCommand = () => {
  const command = new Command()

  command
    .name('show-args')
    .summary('Show args for DEMS-custom Compose command')
    .description(
      'Prints to console all the flags and arguments used for the custom\n' +
        'docker compose command for DEMS.',
    )
    .action(() => {
      logger.info('Compose command params:')
      console.log(JSON.stringify(composeExecParams(), null, 2))
      logger.info('Compose files params:')
      console.log(JSON.stringify(composeFiles({}), null, 2))
    })

  return command
}

export default composeShowArgsCommand()
