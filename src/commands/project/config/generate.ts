import { Command } from 'commander'
import { projectConfig } from '../../../config/project.config'

export function generateProjectConfigCommand() {
  return new Command()
    .name('generate')
    .alias('create')
    .summary('Generate a new deafult project config')
    .action(() => {
      projectConfig.save(projectConfig.default())
    })
}
