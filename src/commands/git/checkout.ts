import { join } from 'node:path'
import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import { git } from '../../utils/git'
import { noIndent } from '../../utils/string'

export function gitCheckoutCommand() {
  return new Command()
    .name('checkout')
    .summary('Checkout all repositories to a specific git branch or tag.')
    .description(
      noIndent(`
        Checkout to an specific git ref (branch, tag) to all managed
        repositories. The 'git checkout' command will be run in all
        repositories defined in the config.json file of the current project.
     `),
    )
    .argument('[gitRef]', 'Custom git ref to checkout to')
    .action(async (gitRef) => {
      const config = projectConfig.load()
      const { reposPath } = cliConfig.load()

      for (const repo in config.repositories) {
        await git.checkout({
          path: join(reposPath, repo),
          ref: gitRef ?? config.git.defaultRef,
        })
      }
    })
}
