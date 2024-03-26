import { describe, expect, mock, test, jest, spyOn, beforeEach, afterEach } from 'bun:test';
import { composeExecParams } from '../../src/utils/compose';
import fs from 'node:fs';
import type { DEMSProjectConfig } from '../../src/config/dems';

mock.module('node:fs', () => ({
  default: {
    existsSync: mock(),
    lstatSync: mock(),
  },
}));

const testConfigJson: DEMSProjectConfig = {
  compose: {
    project_name: 'my-project',
  },
  paths: {
    env_file: '/path/to/env_file',
    repos_root: '/path/to/repos_root',
    repos: {}
  },
  repositories: ['repo1', 'repo2'],
  dockerfile: '',
  git: {
    org_url: '',
    default_ref: ''
  }
};

beforeEach(() => {
  spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('Utils: compose', () => {
  describe('composeExecParams', () => {
    test('should return an array of compose parameters', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.lstatSync as jest.Mock).mockReturnValue({ isFile: () => true });

      const expectedParams = [
        '--project-name my-project',
        '--env-file /path/to/env_file',
        '--env-file /path/to/repos_root/repo1/.env',
        '--env-file /path/to/repos_root/repo2/.env',
      ];

      const params = composeExecParams(testConfigJson);

      expect(params).toEqual(expectedParams);
    });
  });
});
