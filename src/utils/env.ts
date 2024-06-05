import * as fs from 'node:fs'
import type { ProjectConfigSpec } from '../config/project.config'
import logger from './log'
import { flattenObject } from './object'

export const dotEnv = {
  generate(envFilePath: string, config: ProjectConfigSpec): void {
    try {
      const flatConfig = flattenObject(config)
      const envContents = Object.entries(flatConfig)
        .map(([key, value]) => `${key.toUpperCase()}=${value}`)
        .join('\n')

      fs.writeFileSync(envFilePath, envContents)
      logger.info(`.env file was generated in: ${config.projectRootPath}.`)
      logger.info('dot env (.env) file generated!')
    } catch (error) {
      logger.error(
        'There was an error trying to generate the dot env (.env) file.',
        error,
      )
    }
  },
}

export default dotEnv
