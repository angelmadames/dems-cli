import { join } from 'node:path'
import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import dotEnv from '../../utils/env'
import { copyFile } from '../../utils/file-system'
import logger from '../../utils/log'

export function environmentCommand() {
  return new Command()
    .name('environment')
    .alias('env')
    .summary('Updates application environment config (.env)')
    .description(
      'Apps are run in different environments throughout their development\n' +
        "life cycle. To ensure their configuration matches what's\n" +
        'expected for DEMS, we override some of the default env settings.',
    )
    .option(
      '-g, --generate-dot-env',
      "Generate the dot env file for current project's config.json",
    )
    .option(
      '-c, --copy-example-files',
      "Copy the .env.example file of the current project's repositories",
    )
    .action(async (options) => {
      const config = projectConfig.load()
      const configCLI = cliConfig.load()

      if (options.copyExampleFiles) {
        for (const repo in config.repositories) {
          const repoPath = join(configCLI.reposPath, repo)
          copyFile({
            source: join(repoPath, '.env.example'),
            target: join(repoPath, '.env'),
          })
        }
        return
      }

      if (options.generateDotEnv) {
        logger.info("Generating project's dot env file...")
        dotEnv.generate(configCLI.envFile, config)
        return
      }
    })
}

export default environmentCommand()
