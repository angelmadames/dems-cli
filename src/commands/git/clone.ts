import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import { git } from '../../utils/git'
import logger from '../../utils/log'
import { noIndent } from '../../utils/string'

export function gitCloneCommand() {
  return new Command()
    .name('clone')
    .summary('Clones all managed repositories using the specified git ref.')
    .description(
      noIndent(`
        Clones all managed git repositories. The 'git clone' command will be
        run for each repository defined in the config.json file of the current
        project.
      `),
    )
    .option('-g, --git-ref [ref]', 'Git ref to clone repositories')
    .action(async (options) => {
      const config = projectConfig.load()
      const { reposPath } = cliConfig.load()

      logger.info(`Project GitHub organization >> '${config.git.org}'`)
      logger.info(
        `Current project git ref >> '${options.gitRef ?? config.git.defaultRef}'`,
      )

      for (const repo of Object.values(config.repositories)) {
        await git.clone({
          path: reposPath,
          repo: repo,
          ref: options.gitRef ?? config.git.defaultRef,
        })
      }
    })
}
