import { join } from 'node:path'
import { Command } from 'commander'
import { projectConfig } from '../../config/project.config'
import { deletePath } from '../../utils/file-system'
import logger from '../../utils/log'
import sharedOptions from '../../utils/shared-options'

export function cleanDotEnvCommand() {
  return new Command()
    .name('dot-env')
    .aliases(['env', 'dotenv'])
    .summary('Cleanup repositories dot env files (.env)')
    .addOption(sharedOptions.force)
    .action(async (options) => {
      logger.info('Removing dot env files for managed repositories...')

      if (options.force) {
        logger.warn('User interactivity disabled due to --force flag.')
      }

      for (const repoPath in projectConfig.reposPaths()) {
        await deletePath({
          path: join(repoPath, '.env'),
          force: options.force,
        })
      }

      logger.info('dot env files (.env) removed for managed repositories.')
    })
}
