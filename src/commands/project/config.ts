import { Command } from 'commander'
import { projectConfig } from '../../config/project.config'
import logger from '../../utils/log'

function viewProjectConfigCommand() {
  return new Command()
    .name('view')
    .aliases(['get', 'show'])
    .summary('Shows the current project config')
    .action(() => {
      console.log(projectConfig.getConfigContent())
    })
}

function generateProjectConfigCommand() {
  return new Command()
    .name('generate')
    .alias('create')
    .summary('Generate a new deafult project config')
    .action(() => {
      projectConfig.generate()
    })
}

function removeProjectConfigCommand() {
  return new Command()
    .name('remove')
    .alias('delete')
    .summary('Removes the config for the current project')
    .action(() => {
      projectConfig.remove()
    })
}

export function projectConfigCommand() {
  return new Command()
    .name('config')
    .alias('settings')
    .summary('Manages the current project configuration')
    .addCommand(viewProjectConfigCommand())
    .addCommand(generateProjectConfigCommand())
    .action(() => {
      logger.info('Hey! from: "project config".')
    })
}
