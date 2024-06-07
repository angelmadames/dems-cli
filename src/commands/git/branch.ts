import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import { git } from '../../utils/git'
import { join } from 'node:path'

export function gitBranchCommand() {
  return new Command()
    .name('branch')
    .summary('Creates a new git branch in all available repositories.')
    .argument('<ref>', 'The name of the branch to create.')
    .action(async (ref) => {
      const { repositories } = projectConfig.load()
      const { reposPath } = cliConfig.load()

      for (const repo in repositories) {
        await git.branch({
          path: join(reposPath, repo),
          ref,
        })
      }
    })
}
