import { expect, test, describe } from 'bun:test';
import CurrentProjectCommand from '../src/commands/config/current-project';

describe('Test config current-project', () => {
  test('Current project is set by --set flag', () => {
    const command = CurrentProjectCommand;
    const current = 'testProject';
    expect(command.setOptionValue('set', current).getOptionValue('set')).toBe(
      current,
    );
  });
});
