import { Command } from 'commander'
import { composeExec } from '../../utils/compose'
import logger from '../../utils/log'

export function cleanComposeServicesCommand() {
  return new Command()
    .name('compose-services')
    .aliases(['compose', 'services'])
    .summary('Cleanup docker compose services for current project')
    .action((options) => {
      logger.info('Removing docker compose services for current project...')

      try {
        composeExec({
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
