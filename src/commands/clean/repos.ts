import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import { deletePath } from '../../utils/file-system'
import logger from '../../utils/log'
import sharedOptions from '../../utils/shared-options'

export function cleanReposCommand() {
  return new Command()
    .name('repos')
    .aliases(['repositories', 'repo'])
    .summary("Remove the current project's git repositories")
    .addOption(sharedOptions.force)
    .action(async (options) => {
      const { repositories } = projectConfig.load()

      logger.info('Deleting repositories for active project...')
      logger.info(`Current project >> ${cliConfig.activeProject()}`)

      if (options.force) {
        logger.warn('User interactivity disabled due to --force flag.')
      }

      logger.warn('The repositories that will be removed are:')
      for (const repo in repositories) {
        logger.warn(`  - ${repo}`)
      }

      for (const repoPath of projectConfig.reposPaths()) {
        await deletePath({
          path: repoPath,
          force: options.force,
        })
      }

      logger.info('All managed git repositories directories have been removed.')
    })
}
