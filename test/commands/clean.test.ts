import { describe, expect, test } from 'bun:test';
import { $ } from 'bun';
import { projectConfig } from '../../src/config/project';
import {
  createFile,
  createPath,
  isDirectory,
  isFile,
} from '../../src/utils/file-system';

const REPOS_ROOT = './test/repos';
const ENV_FILE = './test/.env';

const prepare = () => {
  createPath({ path: REPOS_ROOT });
  createFile({ file: ENV_FILE, content: 'KEY=VALUE' });
};

describe("Command: 'clean'", () => {
  const config = projectConfig();
  prepare();

  test('Cleans directories using --force', async () => {
    expect(isDirectory(REPOS_ROOT)).toBeTrue();
    expect(isFile(ENV_FILE)).toBeTrue();
    await $`./cli.ts clean -o ${REPOS_ROOT} -e ${ENV_FILE} --force --verbose false`;
    expect(isDirectory(REPOS_ROOT)).toBeFalse();
    expect(isFile(ENV_FILE)).toBeFalse();
  });
});
