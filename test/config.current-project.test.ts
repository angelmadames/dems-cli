import { describe, expect, test } from 'bun:test';
import { spawnSync } from 'bun';
import { currentProjectCommand } from '../src/commands/config/current-project';

describe("Command: 'config current-project'", () => {
  test('is set by --set flag', () => {
    const command = currentProjectCommand();
    const current = 'testProject';
    expect(command.setOptionValue('set', current).getOptionValue('set')).toBe(
      current,
    );
  });

  test('is set by environment variable', async () => {
    const result = spawnSync(['bun', './cli.ts', 'config', 'current-project'], {
      env: { ...process.env, DEMS_CURRENT_PROJECT: 'dev' },
    });
    expect(result.stdout.toString()).toContain('dev');
  });

  test('empty --set flag is missing argument', async () => {
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
