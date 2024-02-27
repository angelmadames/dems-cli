import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { spawnSync } from 'bun';
import { currentProjectCommand } from '../../src/commands/config/current-project';
import cliConfig from '../../src/config/cli';
import { createFile, deletePath } from '../../src/utils/file-system';
import { testSetup } from '../lifecycle';

const PROJECT = 'testProject';
const CURRENT_PROJECT_FILE = './current-project-test';

beforeEach(() => {
  testSetup();
  createFile({ file: CURRENT_PROJECT_FILE, content: 'test' });
});

afterEach(() => {
  deletePath({ path: CURRENT_PROJECT_FILE, force: true });
});

describe("Command: 'config current-project'", () => {
  test('is set by --set flag', () => {
    currentProjectCommand().parse([
      ...process.argv,
      `--set=${PROJECT}`,
      `--current-project-file=${CURRENT_PROJECT_FILE}`,
    ]);
    currentProjectCommand().parse();
    const currentProject = cliConfig.selectCurrentProject(CURRENT_PROJECT_FILE);
    expect(currentProject).toEqual(PROJECT);
  });

  test('is set by environment variable', () => {
    const result = spawnSync(['./cli.ts', 'config', 'current-project'], {
      env: { ...process.env, DEMS_CURRENT_PROJECT: 'dev' },
    });
    expect(result.stdout.toString()).toContain('dev');
  });

  test('empty --set flag is missing argument', () => {
    const command = currentProjectCommand();
    expect(command.getOptionValue('set')).toBeUndefined();
    const result = spawnSync([
      './cli.ts',
      'config',
      'current-project',
      '--set',
    ]);
    expect(result.stderr.toString()).toContain('argument missing');
  });
});
