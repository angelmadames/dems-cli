import { Command } from 'commander'
import { projectConfig } from '../../config/project.config'
import git, { getRepoNameFromURL } from '../../utils/git'
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
    .action((options) => {
      const config = projectConfig.load()

      for (const repo of Object.values(config.repositories)) {
        git.checkout({
          path: getRepoNameFromURL(repo),
          ref: config.git.defaultRef,
        })
      }
    })
}
