import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import { composeExec } from '../../utils/compose'
import logger from '../../utils/log'
import sharedOptions from '../../utils/shared-options'

export function cleanComposeServicesCommand() {
  return new Command()
    .name('compose-services')
    .aliases(['compose', 'services'])
    .summary('Cleanup docker compose services.')
    .addOption(sharedOptions.force)
    .action(async (options) => {
      const { repositories } = projectConfig.load()
      const { reposPath } = cliConfig.load()

      logger.info('Removing docker compose services for current project...')

      if (options.force) {
        logger.warn('User interactivity disabled due to --force flag.')
      }

      try {
        await composeExec({
          command: ['down', '--volumes', '--remove-orphans'],
        })
      } catch (error) {
        logger.warn('Could not remove running services.')
        logger.warn('Probably there are no services running.')
      }

      logger.info(
        'All Docker Compose services were removed alongside their volumes.',
      )
    })
}
