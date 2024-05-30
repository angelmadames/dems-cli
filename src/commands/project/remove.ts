import { Command } from 'commander'
import { projectConfig } from '../../config/project.config'
import { deletePath } from '../../utils/file-system'
import logger from '../../utils/log'

export function removeProjectCommand() {
  return new Command()
    .name('remove')
    .aliases(['destroy', 'delete'])
    .summary('Removes a project from DEMS')
    .argument('<project>', 'Project name to be removed')
    .action((project) => {
      logger.info(`Removing project: ${project}...`)
      deletePath({ path: `${projectConfig.projectRootPath}` })
    })
}
