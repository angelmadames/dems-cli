import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import logger from '../../utils/log'

export function installCommand() {
  return new Command()
    .name('install')
    .summary('Install DEMS and initialize its configuration')
    .action(async () => {
      cliConfig.save(cliConfig.default())
      logger.info('DEMS was successfully initialized.')
      logger.info('Run "dems setup" to configure your first project!')
    })
}
