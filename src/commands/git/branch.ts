import { Command } from 'commander'
import { projectConfig } from '../../config/project'
import git from '../../utils/git'

export const gitBranchCommand = () => {
  const command = new Command()
  const config = projectConfig()

  command
    .name('branch')
    .description('Creates a new git branch in all available repositories.')
    .argument('<ref>', 'The name of the branch to create.')
    .action((ref) => {
      const { repositories } = config
      for (const repo of repositories) {
        git.branch({
          path: `${config.paths.repos_root}/${repo}`,
          ref,
        })
      }
    })

  return command
}

export default gitBranchCommand()
