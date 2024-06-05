import { join } from 'node:path'
import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import dotEnv from '../../utils/env'
import { copyFile } from '../../utils/file-system'
import logger from '../../utils/log'
import { noIndent } from '../../utils/string'

export function environmentCommand() {
  return new Command()
    .name('environment')
    .alias('env')
    .summary('Updates application environment config (.env)')
    .description(
      noIndent(`
      Apps are run in different environments throughout their development
      life cycle. To ensure their configuration matches what's
      expected for DEMS, we override some of the default env settings.
    `),
    )
    .option(
      '-g, --generate-dot-env',
      "Generate the dot env file for current project's config.json",
    )
    .option(
      '-c, --copy-example-files',
      "Copy the .env.example file of the current project's repositories",
    )
    .action((options) => {
      const config = projectConfig.load()

      if (options.copyExampleFiles) {
        for (const path of projectConfig.reposPaths()) {
          copyFile({
            source: join(path, '.env.example'),
            target: join(path, '.env'),
          })
        }
        return
      }

      if (options.generateDotEnv) {
        const configCLI = cliConfig.load()
        logger.info("Generating project's dot env file...")
        dotEnv.generate(configCLI.envFile, config)
        return
      }
    })
}

