import { Command } from 'commander'
import { projectConfig } from '../../config/project.config'
import { dotEnv } from '../../utils/env'
import logger from '../../utils/log'

export function generateDotEnvCommand() {
  return new Command()
    .name('generate-dot-env')
    .summary('Generates the project (.env) dot env file used by Compose')
    .action(() => {
      const config = projectConfig.load()

      logger.info("Generating project's dot env file...")
      dotEnv.generate(config.envFile, config)
    })
}
