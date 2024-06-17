import { Command } from 'commander'
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
      logger.info('Cleaning all local dependencies for managed apps...')

      if (options.force) {
        logger.warn('User interactivity disabled due to --force flag.')
      }

      for (const repoPath of projectConfig.reposPaths()) {
        await deletePath({
          path: repoPath,
          force: options.force,
        })
      }

      logger.info('Dependencies cleanup task completed.')
    })
}
