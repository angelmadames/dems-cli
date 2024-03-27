import { afterEach, beforeAll, beforeEach, jest, mock, spyOn } from 'bun:test';

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
  }));

  mock.module('@inquirer/prompts', () => ({
    confirm: mock(),
  }));

  mock.module('node:child_process', () => ({
    execSync: mock(() => {
      return;
    }),
  }));
});

beforeEach(() => {
  spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
