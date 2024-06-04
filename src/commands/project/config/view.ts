import { Command } from 'commander'
import { cliConfig } from '../../../config/cli.config'
import { projectConfig } from '../../../config/project.config'
import logger from '../../../utils/log'

export function viewProjectConfigCommand() {
  return new Command()
    .name('view')
    .aliases(['get', 'show'])
    .summary('Shows the current project config')
    .action(() => {
      logger.info(`Current project is: ${cliConfig.activeProject()}`)
      console.log(projectConfig.get())
    })
}
