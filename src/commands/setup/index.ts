import { Command } from 'commander'
import logger from '../../utils/log'
import { composeCommand } from '../compose'
import { depsCopyCommand } from '../dependencies/copy'
import { copyExampleFilesCommand } from '../environment/copy-example-files'
import { generateDotEnvCommand } from '../environment/generate-dot-env'
import { gitCloneCommand } from '../git/clone'
import { createProjectCommand } from '../project/create'

export function setupCommand() {
  return new Command()
    .name('setup')
    .alias('init')
    .summary('Setup DEMS for a new project and initialize it')
    .action(async () => {
      await createProjectCommand().parseAsync()
      await gitCloneCommand().parseAsync()

      copyExampleFilesCommand().parse()
      generateDotEnvCommand().parse()

      logger.info('Building services images using Docker Compose.')
      composeCommand().parse(['build'], { from: 'user' })

      logger.info('Provisioning services using Docker Compose.')
      composeCommand().parse(['up -d'], { from: 'user' })

      depsCopyCommand().parse()

      logger.info('To manage your newly created DEMS project, use:')
      logger.info('> dems compose <COMMAND>\n')
      logger.info('✅ Your DEMS project was been successfully initialized!')
      logger.info('🚀 Happy coding!')
    })
}
