import { afterAll, beforeEach, describe, expect, test } from 'bun:test';
import { cleanCommand } from '../../src/commands/clean';
import { cleanDepsCommand } from '../../src/commands/clean/deps';
import { projectConfig } from '../../src/config/project';
import {
  createFile,
  createPath,
  isDirectory,
  isFile,
} from '../../src/utils/file-system';
import { testSetup, testTeardown } from '../lifecycle';

const ENV_FILE = './test/.env';
const REPOS_ROOT = './test/repos';

beforeEach(() => {
  testSetup();
  createPath({ path: REPOS_ROOT });
  createFile({ file: ENV_FILE, content: 'KEY=VALUE' });
});

afterAll(() => {
  testTeardown();
});

describe("Command: 'clean'", () => {
  test('Clean directories using --force', async () => {
    expect(isDirectory(REPOS_ROOT)).toBeTrue();
    expect(isFile(ENV_FILE)).toBeTrue();
    const args = [...process.argv, '-o', REPOS_ROOT, '-e', ENV_FILE, '--force'];
    await cleanCommand().parseAsync(args);
    expect(isDirectory(REPOS_ROOT)).toBeFalse();
    expect(isFile(ENV_FILE)).toBeFalse();
  });

  test('Clean application dependencies', async () => {
    const result = await cleanDepsCommand().parseAsync([
      ...process.argv,
      '--force',
    ]);
    for (const repo of Object.values(projectConfig().paths.repos)) {
      expect(isDirectory(`${repo}/node_modules`)).toBeFalse();
    }
  });
});
