import { describe, expect, test, beforeEach, afterAll } from 'bun:test';
import { projectConfig } from '../../src/config/project';
import { deletePath } from '../../src/utils/file-system';
import { testSetup } from '../test-setup';
import { cloneCommand } from '../../src/commands/clone';
import { localRepoExists } from '../../src/utils/git';

beforeEach(() => {
  testSetup();
});

afterAll(() => {
  deletePath({ path: projectConfig().paths.repos_root, force: true });
});

describe("Command: 'clone'", () => {
  test.todo('Clones git repositories correctly', () => {
    cloneCommand().parse();
    for (const repo of Object.values(projectConfig().paths.repos)) {
      expect(localRepoExists(repo)).toBeTrue();
    }
  });
});
