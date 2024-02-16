import { describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import { spawnSync } from 'bun';
import { currentProjectCommand } from '../../src/commands/config/current-project';
import cliConfig from '../../src/config/cli';
import { createFile, createPath } from '../../src/utils/file-system';

describe("Command: 'config current-project'", () => {
  test('ensure --set option has no default value', () => {
    const command = currentProjectCommand();
    const optionValue = 'project';

    const emptyOptionValue = command.getOptionValue('set');
    const setOptionValue = command
      .setOptionValue('set', optionValue)
      .getOptionValue('set');

    expect(emptyOptionValue).toBeUndefined();
    expect(setOptionValue).toEqual(setOptionValue);
  });

  test('is set by --set flag', () => {
    const current = 'testProject';
    const currentProjectFile = './current-project-test';
    createFile({ file: currentProjectFile, content: '', verbose: false });
    const command = Bun.spawnSync([
      './cli.ts',
      'config',
      'current-project',
      '-s',
      current,
      '-f',
      currentProjectFile,
    ]);
    const currentProject = cliConfig.selectCurrentProject(currentProjectFile);
    expect(command.stdout.toString()).toEqual(currentProject);
    fs.rmSync(currentProjectFile);
  });

  test('is set by environment variable', () => {
    const result = spawnSync(['bun', './cli.ts', 'config', 'current-project'], {
      env: { ...process.env, DEMS_CURRENT_PROJECT: 'dev' },
    });
    expect(result.stdout.toString()).toContain('dev');
  });

  test('empty --set flag is missing argument', () => {
    const command = currentProjectCommand();
    expect(command.getOptionValue('set')).toBeUndefined();
    const result = spawnSync([
      'bun',
      './cli.ts',
      'config',
      'current-project',
      '--set',
    ]);
    expect(result.stderr.toString()).toContain('argument missing');
  });
});
