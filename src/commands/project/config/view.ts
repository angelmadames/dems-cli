import { Command } from 'commander'
import { projectConfig } from '../../../config/project.config'

export function viewProjectConfigCommand() {
  return new Command()
    .name('view')
    .aliases(['get', 'show'])
    .summary('Shows the current project config')
    .action(() => {
      console.log(projectConfig.get())
    })
}
