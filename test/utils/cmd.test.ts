import { describe, expect, type jest, test } from 'bun:test'
import { execSync } from 'node:child_process'
import cmd from '../../src/utils/cmd'
import { removeExtraSpaces } from '../../src/utils/string'

describe('Utils: cmd', () => {
  describe('run', () => {
    test('calls execSync with formatted command', () => {
      const command = '   ls   -l   '
      cmd.run(command)
      expect(execSync).toHaveBeenCalledWith(removeExtraSpaces(command), {
        stdio: 'inherit',
        encoding: 'utf-8',
      })
    })
  })

  describe('runIt', () => {
    test('calls execSync with formatted command & return the output', () => {
      const command = '   ls   -l   '
      const output = 'file1\nfile2'
      ;(execSync as jest.Mock).mockReturnValue(output)
      const result = cmd.runIt(command)

      expect(execSync).toHaveBeenCalledWith(removeExtraSpaces(command), {
        encoding: 'utf-8',
      })
      expect(result).toEqual(output)
    })
  })
})
