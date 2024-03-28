import { describe, expect, type jest, test } from 'bun:test';
import fs from 'node:fs';
import type { DEMSProjectConfig } from '../../src/config/dems';
import { composeExecParams, composeFiles } from '../../src/utils/compose';

const testConfigJson: DEMSProjectConfig = {
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
};

describe('Utils: compose', () => {
  describe('composeExecParams', () => {
    test.skip('should return an array of compose parameters', () => {
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

describe('Utils: compose', () => {
  describe('composeFiles', () => {
    test.skip('should return an array of compose files with --file flag', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.lstatSync as jest.Mock).mockReturnValue({ isFile: () => true });
      (fs.readdirSync as jest.Mock).mockReturnValue([
        'compose1.yml',
        'compose2.yml',
      ]);

      const expectedParams = [
        '--file /path/to/repos_root/repo1/.dems/compose1.yml',
        '--file /path/to/repos_root/repo1/.dems/compose2.yml',
        '--file /path/to/repos_root/repo2/.dems/compose1.yml',
        '--file /path/to/repos_root/repo2/.dems/compose2.yml',
      ];

      const params = composeFiles({
        repos: testConfigJson.repositories,
        reposRoot: testConfigJson.paths.repos_root,
      });

      expect(params).toEqual(expectedParams);
    });
  });
});
