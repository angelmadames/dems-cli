import { expect, test, describe } from 'bun:test';
import { isDirectory, isFile } from '../src/utils/file-system';

describe('Utils: <file-system>', () => {
  test('isFile, returns true if file exists', () => {
    const exists = isFile('./cli.ts');
    expect(exists).toBeTrue();
  });

  test('isFile, returns false if file doesn\'t exist', () => {
    const exists = isFile('./cli.not.exists.ts');
    expect(exists).toBeFalse();
  });

  test('isDirectory, returns true if dir exists', () => {
    const exists = isDirectory('./src');
    expect(exists).toBeTrue();
  });

  test('isDirectory, returns false if dir doesn\'t exist', () => {
    const exists = isDirectory('./src-that-do-not-exist');
    expect(exists).toBeFalse();
  });
});
