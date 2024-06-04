import { join } from 'node:path'
import { confirm, input } from '@inquirer/prompts'
import { Command } from 'commander'
import { CONFIG_PATH } from '../../config/cli.config'
import { projectConfig } from '../../config/project.config'
import { createPath } from '../../utils/file-system'
import logger from '../../utils/log'

export function createProjectCommand() {
  return new Command()
    .name('create')
    .alias('new')
    .summary('Create a new project in DEMS')
    .option('-n, --name', 'Project name')
    .option('-r, --repo [repos...]', 'Project repositories')
    .option('-d, --dockerfile', 'Dockerfile used for local services')
    .option('-g, --git-ref', 'Git ref to clone repositories')
    .action(async (options) => {
      const newProject = projectConfig.default()

      if (options.projectName) {
        newProject.projectName = options.projectName
      } else {
        newProject.projectName = await input({
          message: 'What is the name of the project?',
        })
      }

      newProject.projectRootPath = join(CONFIG_PATH, newProject.projectName)
      newProject.configFile = join(newProject.projectRootPath, 'config.json')

      if (options.gitOrg) {
        newProject.git.org = options.gitOrg
      } else {
        newProject.git.org = await input({
          message: 'What is the GitHub owner (org/user)?',
        })
      }

      newProject.repositories = {}
      if (options.repos) {
      } else {
        while (true) {
          const repo = await input({
            message: 'What is the name of the repository?',
          })
          newProject.repositories[repo] =
            `git@github.com:${newProject.git.org}/${repo}.git`
          if (
            !(await confirm({ message: 'Do you want to add another one?' }))
          ) {
            break
          }
        }
      }

      if (options.dockerfile) newProject.dockerfile = options.dockerfile
      if (options.gitRef) newProject.git.defaultRef = options.gitRef

      console.log(JSON.stringify(newProject, null, 2))
      let confirmProject = false
      confirmProject = await confirm({
        message: 'Proceed to create project with above config?',
      })

      if (confirmProject) {
        createPath({ path: newProject.projectRootPath })
        projectConfig.save(newProject)
        logger.info('New project created successfully.')
      }
    })
}
