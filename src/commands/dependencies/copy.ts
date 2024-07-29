import { join } from 'node:path'
import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import { composeExec } from '../../utils/compose'

export function depsCopyCommand() {
  return new Command()
    .name('copy')
    .summary('Copy dependencies from containers to local repository')
    .action(() => {
      const { repositories, projectName, projectType, monoRepoServices } =
        projectConfig.load()
      const { reposPath } = cliConfig.load()

      if (projectType === 'MonoRepo' && monoRepoServices) {
        for (const path of projectConfig.repoServicesPaths()) {
          composeExec({
            command: [
              'cp',
              `${path.split('/').slice(-1)}:/usr/app/node_modules`,
              join(path, 'node_modules'),
            ],
          })
        }
      } else {
        for (const repo in repositories) {
          composeExec({
            command: [
              'cp',
              `${repo.replace(`${projectName}-`, '')}:/usr/app/node_modules`,
              join(reposPath, repo, 'node_modules'),
            ],
          })
        }
      }
    })
}
