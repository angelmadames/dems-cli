import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import git from '../../utils/git'

export function gitBranchCommand() {
  return new Command()
    .name('branch')
    .summary('Creates a new git branch in all available repositories.')
    .argument('<ref>', 'The name of the branch to create.')
    .action((ref) => {
      const { repositories } = projectConfig.load()

      for (const repo of Object.values(repositories)) {
        git.branch({
          path: `${cliConfig.load().reposPath}/${repo}`,
          ref,
        })
      }
    })
}
