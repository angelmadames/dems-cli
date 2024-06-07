import { join } from 'node:path'
import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import { composeExec } from '../../utils/compose'
import { noIndent } from '../../utils/string'

export function depsCopyCommand() {
  return new Command()
    .name('copy')
    .summary('Copy dependencies from containers to local repository')
    .description(
      noIndent(`
        Copy dependencies from containers to local repository to enable
        IDE features such as IntelliSense.
    `),
    )
    .action(() => {
      const { repositories, projectName } = projectConfig.load()
      const { reposPath } = cliConfig.load()

      for (const repo in repositories) {
        composeExec({
          command: [
            'cp',
            `${repo.replace(`${projectName}-`, '')}:/usr/app/node_modules`,
            join(reposPath, repo, 'node_modules'),
          ],
        })
      }
    })
}
