import { afterEach, beforeAll, jest, mock } from 'bun:test'

beforeAll(() => {
  mock.module('node:fs', () => ({
    default: {
      copyFileSync: mock(),
      existsSync: mock(),
      lstatSync: mock(),
      mkdirSync: mock(),
      readdirSync: mock(),
      rmdirSync: mock(),
      rmSync: mock(),
      readFileSync: mock(),
      writeFileSync: mock(),
    },
  }))

  mock.module('@inquirer/prompts', () => ({
    confirm: mock(),
  }))

  mock.module('node:child_process', () => ({
    execSync: mock(),
  }))

  mock.module('../src/utils/log', () => ({
    default: {
      info: mock(),
      warn: mock(),
      error: mock(),
    },
  }))
})

/*
beforeEach(() => {
  spyOn(console, 'log').mockImplementation(() => {})
  })
*/

afterEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})
