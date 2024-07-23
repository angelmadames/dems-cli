import fs from 'node:fs'
import { join } from 'node:path'
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
  const { filesPath } = projectConfig.load()
  const reposPath = projectConfig.reposPaths()

  const files = []

  for (const repo of reposPath) {
    const paths = fs.readdirSync(join(repo, filesPath))

    for (const path of paths) {
      if (path.match(`^.*${prefix}.*\.yml$`)) {
        files.push(`--file ${join(repo, filesPath, path)}`)
      }
    }
  }

  return files
}

export function composeExecParams() {
  const { projectName, envFile } = projectConfig.load()
  const reposPath = projectConfig.reposPaths()

  const params = []

  params.push(`--project-name ${projectName}`)
  params.push(`--env-file ${envFile}`)

  for (const repo of reposPath) {
    const envFile = join(repo, '.env')
    if (isFile(envFile)) {
      params.push(`--env-file ${envFile}`)
    }
  }

  return params
}
