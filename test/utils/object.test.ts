import { beforeEach, describe, expect, jest, mock, test } from 'bun:test';
import fs from 'node:fs';
import { isFile } from '../../src/utils/file-system';
import log from '../../src/utils/log';
import {
  flattenObject,
  replaceKeyValue,
  replaceKeysInFile,
} from '../../src/utils/object';

mock.module('node:fs', () => ({
  default: {
    existsSync: mock(),
    lstatSync: mock(),
    readFileSync: mock(),
    writeFileSync: mock(),
  },
}));

mock.module('../../src/utils/file-system', () => ({
  isFile: mock(),
}));

mock.module('../../src/utils/log', () => ({
  default: {
    info: mock(),
    warning: mock(),
    success: mock(),
    error: mock(),
  },
}));

describe('Utils: object', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('replaceKeyFile', () => {
    test('updates the key-value pair in the file', () => {
      const path = 'test-path';
      const key = 'test_key';
      const value = 'test value';

      (isFile as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('test_key=test-old-value');

      replaceKeyValue(path, key, value);

      expect(log.error).not.toHaveBeenCalled();
      expect(log.success).toHaveBeenCalledWith(
        'File test-path updated successfully with test_key=test value.',
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'test-path',
        'test_key=test value',
      );
    });

    test('logs an error if the file is not a valid file', () => {
      const path = 'test-path';
      const key = 'test_key';
      const value = 'test value';

      (isFile as jest.Mock).mockReturnValue(false);

      replaceKeyValue(path, key, value);

      expect(log.error).toHaveBeenCalledWith(
        'File test-path is not a valid file.',
      );
      expect(log.success).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    test('throws an error if an error occurs while updating the file', () => {
      const path = 'test-path';
      const key = 'test-key';
      const value = 'test-value';

      (isFile as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      expect(() => replaceKeyValue(path, key, value)).toThrow(Error);
      expect(log.error).toHaveBeenCalledWith(
        'Error updating file test-path. See below for more info:',
      );
      expect(log.success).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('replaceKeysInFile', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('updates the keys in the file', () => {
      const filePath = 'test-file-path';
      const replaceMap = new Map<string, string>([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]);

      (fs.readFileSync as jest.Mock).mockReturnValue(
        'key1=test-old-value\nkey2=test-old-value',
      );

      replaceKeysInFile(filePath, replaceMap);

      expect(log.error).not.toHaveBeenCalled();
      expect(log.success).toHaveBeenCalledWith(
        'File test-file-path updated successfully with replacements.',
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'test-file-path',
        'key1=value1\nkey2=value2',
      );
    });

    test('logs an error if the file is not a valid file', () => {
      const filePath = 'test-file-path';
      const replaceMap = { key1: 'value1', key2: 'value2' };

      (isFile as jest.Mock).mockReturnValue(false);

      replaceKeysInFile(filePath, replaceMap);

      expect(log.error).toHaveBeenCalledWith('File test-file-path is not a valid file.');
      expect(log.success).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    test('throws an error if an error occurs while updating the file', () => {
      const filePath = 'test-file-path';
      const replaceMap = { key1: 'value1', key2: 'value2' };

      (isFile as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      expect(() => replaceKeysInFile(filePath, replaceMap)).toThrow(Error);
      expect(log.error).toHaveBeenCalledWith('Error updating file test-file-path. See below for more info:');
      expect(log.success).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('flattenObject', () => {
    test('flattens a nested object with default separator', () => {
      const obj = {
        key1: 'value1',
        nested: {
          key2: 'value2',
          key3: {
            key4: 'value4',
          },
        },
      };
      const flattened = flattenObject(obj);
      expect(flattened).toEqual({
        key1: 'value1',
        nested_key2: 'value2',
        nested_key3_key4: 'value4',
      });
    });

    test('flattens a nested object with custom separator', () => {
      const obj = {
        key1: 'value1',
        nested: {
          key2: 'value2',
          key3: {
            key4: 'value4',
          },
        },
      };
      const flattened = flattenObject(obj, '', '.');
      expect(flattened).toEqual({
        key1: 'value1',
        'nested.key2': 'value2',
        'nested.key3.key4': 'value4',
      });
    });

    test('flattens an object with arrays without modifying them', () => {
      const obj = {
        key1: 'value1',
        array: 1,
      };
      const flattened = flattenObject(obj);
      expect(flattened).toEqual({
        key1: 'value1',
        array: 1,
      });
    });
  });
});
