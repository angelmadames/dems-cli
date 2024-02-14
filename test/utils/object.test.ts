import { describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import { type DEMSProjectConfig, defaultConfig } from '../../src/config/dems';
import { createFile, isFile } from '../../src/utils/file-system';
import {
  flattenObject,
  replaceKeyValue,
  replaceKeysInFile,
} from '../../src/utils/object';

describe('Utils: object', () => {
  const testFile = '.env.test';
  const testFileContent = 'KEY1=VALUE1\nKEY2=VALUE2';

  test('Replaces a key value in a file', () => {
    createFile({ file: testFile, content: testFileContent, verbose: false });
    expect(isFile(testFile)).toBeTrue();

    replaceKeyValue(testFile, 'KEY1', 'VALUE10', false);
    const replacedContent = fs.readFileSync(testFile, 'utf8');
    expect(replacedContent).toContain('VALUE10');
  });

  test("Replaces various keys' values in a file", () => {
    createFile({ file: testFile, content: testFileContent, verbose: false });
    expect(isFile(testFile)).toBeTrue();

    replaceKeysInFile(
      testFile,
      {
        KEY1: 'VALUE_KEY1',
        KEY2: 'VALUE_KEY2',
      },
      false,
    );

    const replacedContent = fs.readFileSync(testFile, 'utf8');
    expect(replacedContent).toContain('VALUE_KEY1');
    expect(replacedContent).toContain('VALUE_KEY2');
    fs.rmSync(testFile);
  });

  test('Flattens a simnple nested object', () => {
    const input = {
      key1: {
        key1_a: 'value1',
      },
    };

    const expectedOutput = {
      key1_key1_a: 'value1',
    };

    expect(flattenObject(input)).toEqual(expectedOutput);
  });

  test('Flattens a deeply nested object', () => {
    const input = {
      key1: {
        key1_a: {
          key1_a_a: 'value1',
        },
        key1_b: 'value2',
      },
      key2: {
        key2_a: {
          key2_a_a: {
            key2_a_a_a: 'value3',
          },
        },
      },
    };

    const expectedOutput = {
      key1_key1_a_key1_a_a: 'value1',
      key1_key1_b: 'value2',
      key2_key2_a_key2_a_a_key2_a_a_a: 'value3',
    };

    expect(flattenObject(input)).toEqual(expectedOutput);
  });

  test('Flattens an empty object', () => {
    const input = {};
    const expectedOutput = {};
    expect(flattenObject(input)).toEqual(expectedOutput);
  });
});
