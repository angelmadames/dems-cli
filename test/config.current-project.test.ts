import { expect, test } from 'bun:test';
import CurrentProjectCommand from '../src/commands/config/current-project';

test('Current project is set by --set flag', () => {
  const current = 'testProject';
  expect(
    CurrentProjectCommand.setOptionValue('set', current).getOptionValue('set'),
  ).toBe(current);
});
