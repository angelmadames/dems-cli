import { join } from 'node:path'
import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
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
      const { repositories } = projectConfig.load()
      const { reposPath } = cliConfig.load()

      logger.info('Removing dot env files for managed repositories...')

      if (options.force) {
        logger.warn('User interactivity disabled due to --force flag.')
      }

      for (const repo in repositories) {
        await deletePath({
          path: join(reposPath, repo, '.env'),
          force: options.force,
        })
      }

      logger.info('dot env files (.env) removed for managed repositories.')
    })
}
