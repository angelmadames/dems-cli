import { join } from 'node:path'
import { confirm, input } from '@inquirer/prompts'
import { Command } from 'commander'
import { CONFIG_PATH, cliConfig } from '../../config/cli.config'
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
    .option('-f, --files-path', "Path for project's DEMS-files")
    .option('-e, --env-file', 'The .env file path')
    .action(async (options) => {
      const newProject = projectConfig.default()

      if (options.projectName) {
        newProject.projectName = options.projectName
      } else {
        newProject.projectName = await input({
          message: 'What is the name of the project?',
        })
      }
      cliConfig.setActiveProject(newProject.projectName)

      if (options.filesPath) {
        newProject.filesPath = options.filesPath
      } else {
        newProject.filesPath = await input({
          message: `DEMS file path? (Relative to repos' root path)`,
          default: newProject.filesPath,
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

      if (options.dockerfile) {
        newProject.dockerfile = options.dockerfile
      } else {
        newProject.dockerfile = await input({
          message: `Dockerfile path? (Relative to ${newProject.filesPath})`,
          default: newProject.dockerfile,
        })
      }

      if (options.envFile) {
        newProject.envFile = options.envFile
      } else {
        newProject.envFile = await input({
          message: 'Project root .env path?',
          default: newProject.envFile.replace('demo', newProject.projectName),
        })
      }

      if (options.gitRef) newProject.git.defaultRef = options.gitRef

      console.log(JSON.stringify(newProject, null, 2))

      if (
        await confirm({
          message: 'Proceed to create project with above config?',
        })
      ) {
        createPath({ path: newProject.projectRootPath })

        projectConfig.save(newProject)
        logger.info('New project created successfully.')
      }
    })
}
