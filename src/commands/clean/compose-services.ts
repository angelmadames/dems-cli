import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import logger from '../../utils/log'
import sharedOptions from '../../utils/shared-options'
import { composeExec } from '../../utils/compose'

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

      await composeExec({
        command: [
          'down',
          '--volumes',
          '--remove-orphans'
        ]
      })

      logger.info('All Docker Compose services were removed alongside their volumes.')
    })
}
