import { describe, expect, test } from 'bun:test';
import cmd from '../../src/utils/cmd';

describe('Utils: cmd', () => {
  test('runs commands and returns undefined', () => {
    expect(cmd.run('cat /dev/null')).toBeUndefined();
  });

  test('removes extra spaces from multi-line and returns undefined', () => {
    expect(cmd.run('cat  /dev/null  ')).toBeUndefined();
  });

  test('returns output to stdout', () => {
    const output = cmd.runIt("echo 'Hello world!'");
    expect(output.trim()).toEqual('Hello world!');
  });
});
