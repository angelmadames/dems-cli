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

  mock.module('../src/config/cli', () => ({
    currentProject: () => 'test-project',
    currentProjectFile: () => 'test-project-file',
    default: {
      currentProject: 'test-project',
      currentProjectFile: 'test-project-fioe',
      root: '/path/to/root',
      file: '/path/to/file',
    },
  }));

  mock.module('../src/config/project', () => ({
    projectConfig: () => ({
      compose: {
        project_name: 'my-project',
      },
      paths: {
        env_file: '/path/to/env_file',
        repos_root: '/path/to/repos_root',
        repos: {},
      },
      repositories: ['repo1', 'repo2'],
      dockerfile: '',
      git: {
        org_url: '',
        default_ref: '',
      },
    }),
  }));

  mock.module('@inquirer/prompts', () => ({
    confirm: mock(),
  }));

  mock.module('node:child_process', () => ({
    execSync: mock(),
  }));
});

beforeEach(() => {
  spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
