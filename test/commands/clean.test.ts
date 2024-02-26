import { describe, expect, test, beforeEach } from 'bun:test';
import {
  createFile,
  createPath,
  isDirectory,
  isFile,
} from '../../src/utils/file-system';
import { omitConsoleLogs } from '../helpers';
import { cleanCommand } from '../../src/commands/clean';
import { cleanDepsCommand } from '../../src/commands/clean/deps';

const ENV_FILE = './test/.env';
const REPOS_ROOT = './test/repos';

beforeEach(() => {
  omitConsoleLogs();
  createPath({ path: REPOS_ROOT });
  createFile({ file: ENV_FILE, content: 'KEY=VALUE' });
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

  test.todo('Clean application dependencies', async () => {
    const result = await cleanDepsCommand().parseAsync([
      ...process.argv,
      '--force',
    ]);
    expect(result).toBeDefined();
  });
});
