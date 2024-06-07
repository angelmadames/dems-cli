import { describe, expect, test } from 'bun:test'
import {
  type ProjectConfigSpec,
  projectConfig,
} from '../../src/config/project.config'

describe('Config: Project', () => {
  describe('default()', () => {
    test('should return a default config object matching ProjectConfigSpec', () => {
      const config: ProjectConfigSpec = projectConfig.default()

      expect(config).toBeObject()
      expect(config.projectName).toBeString()
    })
  })
})
