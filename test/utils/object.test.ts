import { describe, expect, test } from 'bun:test';
import { replaceKeyValue, replaceKeysInFile } from '../../src/utils/object';
import { createFile, isFile } from '../../src/utils/file-system';
import fs from 'node:fs';

describe('Utils: object', () => {
  const testFile = '.env.test';
  const testFileContent = 'KEY1=VALUE1\nKEY2=VALUE2';

  test('Replaces a key value in a file', () => {
    createFile(testFile, testFileContent, false);
    expect(isFile(testFile)).toBeTrue();

    replaceKeyValue(testFile, 'KEY1', 'VALUE10', false);
    const replacedContent = fs.readFileSync(testFile, 'utf8');
    expect(replacedContent).toContain('VALUE10');

    fs.rmSync(testFile);
    expect(isFile(testFile)).toBeFalse();
  });

  test('Replaces various keys\' values in a file', () => {
    createFile(testFile, testFileContent, false);
    expect(isFile(testFile)).toBeTrue();

    replaceKeysInFile(testFile, {
      KEY1: 'VALUE_KEY1',
      KEY2: 'VALUE_KEY2',
    }, false);

    const replacedContent = fs.readFileSync(testFile, 'utf8');
    expect(replacedContent).toContain('VALUE_KEY1');
    expect(replacedContent).toContain('VALUE_KEY2');

    fs.rmSync(testFile);
    expect(isFile(testFile)).toBeFalse();
  });
});
