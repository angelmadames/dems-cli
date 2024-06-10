import fs from 'node:fs'
import { join } from 'node:path'
import { cliConfig } from '../config/cli.config'
import { projectConfig } from '../config/project.config'
import cmd from './cmd'
import { isFile } from './file-system'
import type { ComposeExecParams, ComposeFilesParams } from './interfaces'

export function composeExec({ command }: ComposeExecParams) {
  let composeCommand = ['docker', 'compose']

  composeCommand = composeCommand
    .concat(composeExecParams())
    .concat(composeFiles({ prefix: 'compose' }))
    .concat(command)

  return cmd.run(composeCommand.join(' '))
}

export function composeFiles({ prefix = 'compose' }: ComposeFilesParams) {
  const { repositories } = projectConfig.load()
  const { reposPath, filesPath } = cliConfig.load()

  const composeFiles = []

  for (const repo in repositories) {
    const files = fs.readdirSync(join(reposPath, repo, filesPath))
    for (const file of files) {
      if (file.match(`^.*${prefix}.*\.yml$`)) {
        composeFiles.push(`--file ${join(reposPath, repo, filesPath, file)}`)
      }
    }
  }

  return composeFiles
}

export function composeExecParams() {
  const { projectName, envFile, repositories } = projectConfig.load()
  const { reposPath } = cliConfig.load()

  const params = []

  params.push(`--project-name ${projectName}`)
  params.push(`--env-file ${envFile}`)

  for (const repo in repositories) {
    const envFile = join(reposPath, repo, '.env')
    if (isFile(envFile)) {
      params.push(`--env-file ${envFile}`)
    }
  }

  return params
}
