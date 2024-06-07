import { describe, test } from 'bun:test'
import { cliConfig } from '../../src/config/cli.config'

describe('Utils: compose', () => {
  describe.todo('composeExecParams', () => {
    test.todo('should return an array of compose parameters', () => {})
  })

  describe('composeFiles', () => {
    test('should return an array of compose files with --file flag', () => {
      console.log(cliConfig.default())
    })
  })
})
