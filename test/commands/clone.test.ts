import { afterAll, beforeEach, describe, expect, test } from 'bun:test';
import { cloneCommand } from '../../src/commands/clone';
import { projectConfig } from '../../src/config/project';
import { localRepoExists } from '../../src/utils/git';
import { testSetup, testTeardown } from '../lifecycle';

beforeEach(() => {
  testSetup();
});

afterAll(() => {
  testTeardown();
});

describe("Command: 'clone'", () => {
  test.todo('Clones git repositories correctly', () => {
    cloneCommand().parse();
    for (const repo of Object.values(projectConfig().paths.repos)) {
      expect(localRepoExists(repo)).toBeTrue();
    }
  });
});
