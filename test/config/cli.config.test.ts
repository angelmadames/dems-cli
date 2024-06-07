import { describe, expect, test } from 'bun:test'
import { homedir } from 'node:os'
import { type CLIConfigSpec, cliConfig } from '../../src/config/cli.config'

describe('Config: CLI', () => {
  describe('default()', () => {
    test('should return a default config object matching CLIConfigSpec', () => {
      const config: CLIConfigSpec = cliConfig.default()
      const homeDir = homedir()

      expect(config).toBeObject()
      expect(config.rootPath).toInclude(homeDir)
      expect(config.configFile).toInclude(homeDir)
      expect(config.activeProjectFile).toInclude(homeDir)
      expect(config.reposPath).toBeString()
      expect(config.filesPath).toBeString()
    })
  })
})
