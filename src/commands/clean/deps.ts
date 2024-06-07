import { join } from 'node:path'
import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import { deletePath } from '../../utils/file-system'
import logger from '../../utils/log'
import sharedOptions from '../../utils/shared-options'

export function cleanDepsCommand() {
  return new Command()
    .name('deps')
    .aliases(['dependencies'])
    .summary('Cleanup repositories dependencies (node_modules).')
    .description('Cleans all repos dependencies locally installed.')
    .addOption(sharedOptions.force)
    .action(async (options) => {
      const { repositories } = projectConfig.load()
      const { reposPath } = cliConfig.load()

      logger.info('Cleaning all local dependencies for managed apps...')

      if (options.force) {
        logger.warn('User interactivity disabled due to --force flag.')
      }

      for (const repo in repositories) {
        await deletePath({
          path: join(reposPath, repo, 'node_modules'),
          force: options.force,
        })
      }

      logger.info('Dependencies cleanup task completed.')
    })
}
