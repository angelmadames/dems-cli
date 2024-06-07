import * as fs from 'node:fs'
import { join } from 'node:path'
import { cliConfig } from '../config/cli.config'
import type { ProjectConfigSpec } from '../config/project.config'
import logger from './log'
import { flattenObject } from './object'
import { toUpperSnakeCase } from './string'

export const dotEnv = {
  generate(envFilePath: string, config: ProjectConfigSpec): void {
    try {
      const configCLI = cliConfig.load()
      const flatConfig = flattenObject(config)

      for (const repo in config.repositories) {
        flatConfig[`${toUpperSnakeCase(repo)}_PATH`] = `'${join(
          configCLI.reposPath,
          repo,
        )}'`
      }

      const envContents = Object.entries(flatConfig)
        .map(([key, value]) => `${key.toUpperCase()}=${value}`)
        .join('\n')

      fs.writeFileSync(envFilePath, envContents)
      logger.info(`.env file was generated in: ${config.projectRootPath}.`)
      logger.info('dot env (.env) file generated!')
    } catch (error) {
      logger.error(
        'There was an error trying to generate the dot env (.env) file.',
      )
      throw new Error(`${error}`)
    }
  },
}
