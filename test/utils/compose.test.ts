import { describe, expect, type jest, test } from 'bun:test'
import fs from 'node:fs'
import { projectConfig } from '../../src/config/project'
import { composeExecParams, composeFiles } from '../../src/utils/compose'

describe('Utils: compose', () => {
  describe('composeExecParams', () => {
    test('should return an array of compose parameters', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({ isFile: () => true })

      const expectedParams = [
        '--project-name my-project',
        '--env-file /path/to/env_file',
        '--env-file /path/to/repos_root/repo1/.env',
        '--env-file /path/to/repos_root/repo2/.env',
      ]

      const params = composeExecParams(projectConfig())

      expect(params).toEqual(expectedParams)
    })
  })

  describe('composeFiles', () => {
    test('should return an array of compose files with --file flag', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({ isFile: () => true })
      ;(fs.readdirSync as jest.Mock).mockReturnValue([
        'compose1.yml',
        'compose2.yml',
      ])

      const expectedParams = [
        '--file /path/to/repos_root/repo1/.dems/compose1.yml',
        '--file /path/to/repos_root/repo1/.dems/compose2.yml',
        '--file /path/to/repos_root/repo2/.dems/compose1.yml',
        '--file /path/to/repos_root/repo2/.dems/compose2.yml',
      ]

      const params = composeFiles({
        repos: projectConfig().repositories,
        reposRoot: projectConfig().paths.repos_root,
      })

      expect(params).toEqual(expectedParams)
    })
  })
})
