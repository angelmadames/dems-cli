import { Command } from 'commander'
import logger from '../../utils/log'
import sharedOptions from '../../utils/shared-options'
import { cleanDepsCommand } from './deps'
import { cleanDotEnvCommand } from './dot-env'
import { cleanReposCommand } from './repos'
import { cleanComposeServicesCommand } from './compose-services'

export function cleanAllCommand() {
  return new Command()
    .name('all')
    .aliases(['everything'])
    .summary('Cleanup all project resources (repos, deps, .env)')
    .addOption(sharedOptions.force)
    .action(async (options) => {
      logger.info('Cleaning all local dependencies for managed apps...')

      const flags = [''];
      if (options.force) {
        logger.warn('User interactivity disabled due to --force flag.')
        flags.push('--force')
      }

      await cleanComposeServicesCommand().parseAsync(flags)
      await cleanDepsCommand().parseAsync(flags)
      await cleanDotEnvCommand().parseAsync(flags)
      await cleanReposCommand().parseAsync(flags)

      logger.info('Cleanup of everything completed.')
    })
}
