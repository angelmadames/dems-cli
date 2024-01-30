import { expect, test, describe } from 'bun:test';
import { currentProjectCommand } from '../src/commands/config/current-project';
import { spawnSync } from 'bun';

describe('Test config current-project', () => {
  test('Current project is set by --set flag', () => {
    const command = currentProjectCommand();
    const current = 'testProject';
    expect(command.setOptionValue('set', current).getOptionValue('set')).toBe(
      current,
    );
  });

  test('Cuurent project is set by environment variable', async () => {
    const result = spawnSync(['bun', './cli.ts', 'config', 'current-project'], {
      env: { ...process.env, DEMS_CURRENT_PROJECT: 'dev' },
    });
    expect(result.stdout.toString()).toContain('dev');
  });
});
