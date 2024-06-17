import { Command } from 'commander'
import logger from '../../utils/log'
import sharedOptions from '../../utils/shared-options'
import { cleanComposeServicesCommand } from './compose-services'
import { cleanDepsCommand } from './deps'
import { cleanDotEnvCommand } from './dot-env'
import { cleanReposCommand } from './repos'

export function cleanAllCommand() {
  return new Command()
    .name('all')
    .aliases(['everything'])
    .summary('Cleanup all project resources (repos, deps, .env)')
    .addOption(sharedOptions.force)
    .action(async (options) => {
      logger.info('Cleaning all local dependencies for managed apps...')

      cleanComposeServicesCommand().parse()
      await cleanDepsCommand().parseAsync()
      await cleanDotEnvCommand().parseAsync()
      await cleanReposCommand().parseAsync()

      logger.info('Cleanup of everything completed.')
    })
}
