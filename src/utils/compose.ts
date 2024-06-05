import fs from 'node:fs'
import path from 'node:path'
import { cliConfig } from '../config/cli.config'
import { projectConfig } from '../config/project.config'
import cmd from './cmd'
import { isFile } from './file-system'
import { validateLocalGitRepo } from './git'
import type { ComposeExecParams, ComposeFilesParams } from './interfaces'

export const composeExec = ({
  envFiles = composeExecParams(),
  files = composeFiles({}),
  command,
}: ComposeExecParams) => {
  let composeCommand = ['docker', 'compose']
  composeCommand = composeCommand.concat(envFiles).concat(files).concat(command)
  // @TODO: Use native Bun.spawnSync when they support stdio with 'inherit'.
  // const result = Bun.spawnSync(command.join(' ').split(' '));
  const result = cmd.run(composeCommand.join(' '))
  return result
}

export const composeFiles = ({
  filesDir = '.dems',
  prefix = 'compose',
  reposRoot = cliConfig.load().reposPath,
  repos = Object.values(projectConfig.load().repositories),
}: ComposeFilesParams) => {
  const composeFiles: string[] = []
  const dirs = []

  for (const dir of repos) {
    validateLocalGitRepo(`${reposRoot}/${dir}`)
    dirs.push(`${reposRoot}/${dir}/${filesDir}`)
  }

  for (const dir of dirs) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      if (file.match(`^.*${prefix}.*\.yml$`)) {
        composeFiles.push(`--file ${path.join(dir, file)}`)
      }
    }
  }

  return composeFiles
}

export const composeExecParams = (config = projectConfig()) => {
  const params = []

  params.push(`--project-name ${config.compose.project_name}`)
  params.push(`--env-file ${config.paths.env_file}`)

  for (const repo of config.repositories) {
    const envFile = `${config.paths.repos_root}/${repo}/.env`
    if (isFile(envFile)) {
      params.push(`--env-file ${envFile}`)
    }
  }

  return params
}
