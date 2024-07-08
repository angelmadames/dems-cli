import { join } from 'node:path'
import { confirm, input, select } from '@inquirer/prompts'
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
    .option('-t, --project-type', 'Sets the project type')
    .action(async (options) => {
      const newProject = projectConfig.default()

      if (options.projectName) {
        newProject.projectName = options.projectName
      } else {
        newProject.projectName = await input({
          message: 'What is the name of the project?',
        })
      }

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
      newProject.envFile = join(newProject.projectRootPath, '.env')

      if (options.projectType) {
        newProject.projectType = options.projectType
      } else {
        newProject.projectType = await select({
          message: 'Select the project type',
          choices: [
            {
              name: 'Single',
              value: 'Single',
              description:
                'A single repository containining a single application',
            },
            {
              name: 'Mono Repo',
              value: 'MonoRepo',
              description:
                'A single repository containing multiple applications or services',
            },
            {
              name: 'Multi Repo',
              value: 'MultiRepo',
              description:
                'Multiple repositories containing single applications or services',
            },
          ],
        })
      }

      cliConfig.setActiveProject(newProject.projectName)

      if (options.gitOrg) {
        newProject.git.org = options.gitOrg
      } else {
        newProject.git.org = await input({
          message: 'What is the GitHub owner (org/user)?',
        })
      }

      newProject.repositories = {}
      if (options.repos) {
        for (const repo of options.repos) {
          newProject.repositories[repo] =
            `git@github.com:${newProject.git.org}/${repo}.git`
        }
      } else {
        switch (newProject.projectType) {
          case 'Single' || 'MonoRepo': {
            const repo = await input({
              message: 'What is the name of the repository?',
            })
            newProject.repositories[repo] =
              `git@github.com:${newProject.git.org}/${repo}.git`
            break
          }
          case 'MultiRepo': {
            do {
              const repo = await input({
                message: 'What is the name of the repository?',
              })
              newProject.repositories[repo] =
                `git@github.com:${newProject.git.org}/${repo}.git`
            } while (await confirm({ message: 'Add another one?' }))
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
