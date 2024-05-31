import { confirm } from '@inquirer/prompts'
import { Command } from 'commander'
import { projectConfig } from '../../../config/project.config'

export function removeProjectCommand() {
  return new Command()
    .name('remove')
    .aliases(['destroy', 'delete'])
    .summary('Removes a project from DEMS')
    .argument('<project>', 'Project name to be removed')
    .action(async (project) => {
      const deletionConfirmation = await confirm({
        message: `Do you want to remove project ${project}?`,
      })
      if (deletionConfirmation) {
        projectConfig.remove(project)
      }
    })
}
