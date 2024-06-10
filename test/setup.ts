import { afterEach, beforeAll, beforeEach, jest, mock, spyOn } from 'bun:test'
import logger from '../src/utils/log'

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
})

beforeEach(() => {
  spyOn(logger, 'info').mockImplementation(() => {})
  spyOn(logger, 'warn').mockImplementation(() => {})
  spyOn(logger, 'error').mockImplementation(() => {})
})

afterEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})
