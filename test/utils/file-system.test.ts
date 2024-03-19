import { afterEach, beforeEach, describe, expect, jest, mock, test, spyOn } from 'bun:test';
import fs from 'node:fs';
import {
  copyFile,
  createFile,
  createPath,
  isDirectory,
  isFile,
} from '../../src/utils/file-system';
import log from '../../src/utils/log';

mock.module('node:fs', () => ({
  default: {
    existsSync: mock(),
    lstatSync: mock(),
    writeFileSync: mock(),
    copyFileSync: mock(),
    mkdirSync: mock(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  spyOn(console, 'log').mockImplementation(() => {});
})

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Utils: file-system', () => {
  describe('isFile', () => {
    test('returns true if file exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.lstatSync as jest.Mock).mockReturnValue({ isFile: () => true });

      expect(isFile('./cli.ts')).toBeTrue();
      expect(fs.existsSync).toHaveBeenCalledWith('./cli.ts');
      expect(fs.lstatSync).toHaveBeenCalledWith('./cli.ts');
    });

    test('returns false if file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      expect(isFile('./cli.not.exists.ts')).toBeFalse();
      expect(fs.existsSync).toHaveBeenCalledWith('./cli.not.exists.ts');
      expect(fs.lstatSync).not.toHaveBeenCalled();
    });

    test('returns false if path exists but is not a file', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.lstatSync as jest.Mock).mockReturnValue({ isFile: () => false });

      expect(isFile('test-path')).toBeFalse();
      expect(fs.existsSync).toHaveBeenCalledWith('test-path');
      expect(fs.lstatSync).toHaveBeenCalledWith('test-path');
    });
  });

  describe('isDirectory', () => {
    test('returns true if path exists and is a directory', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => true });

      expect(isDirectory('test-path')).toBeTrue();
      expect(fs.existsSync).toHaveBeenCalledWith('test-path');
      expect(fs.lstatSync).toHaveBeenCalledWith('test-path');
    });

    test('returns false if path does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      expect(isDirectory('test-path')).toBeFalse();
      expect(fs.existsSync).toHaveBeenCalledWith('test-path');
      expect(fs.lstatSync).not.toHaveBeenCalled();
    });

    test('returns false if path exists but is not a directory', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => false });

      expect(isDirectory('test-path')).toBeFalse();
      expect(fs.existsSync).toHaveBeenCalledWith('test-path');
      expect(fs.lstatSync).toHaveBeenCalledWith('test-path');
    });
  });

  describe('createFile', () => {
    test('creates a new file when it does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const file = './a-new-file';
      const content = 'hello there from a-new-file';
      createFile({ file, content });

      expect(fs.existsSync).toHaveBeenCalledWith(file);
      expect(fs.writeFileSync).toHaveBeenCalledWith(file, content, 'utf8');
    });

    test('overrides an existing file if override set to true', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.lstatSync as jest.Mock).mockReturnValue({ isFile: () => true });
      const file = './a-new-file';
      const content = 'hello there from a-new-file';
      createFile({ file, content, override: true });

      expect(fs.existsSync).toHaveBeenCalledWith(file);
      expect(fs.writeFileSync).toHaveBeenCalledWith(file, content, 'utf8');
    });

    test('does not create a new file if it exists and override is false', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.lstatSync as jest.Mock).mockReturnValue({ isFile: () => true });
      const file = './a-new-file';
      const content = 'hello there from a-new-file';
      createFile({ file, content, override: false });

      expect(fs.existsSync).toHaveBeenCalledWith(file);
      expect(fs.writeFileSync).not.toHaveBeenCalledWith(file, content, 'utf8');
    });
  });

  describe('copyFile', () => {
    test('logs error and throw an error if source is not a valid file', () => {
      const source = 'invalid-file.txt';
      const target = 'target-file.txt';

      // Target & source does not exist
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      expect(() => copyFile({ source, target })).toThrow(Error);
      expect(fs.copyFileSync).not.toHaveBeenCalled();
    });

    test('copies file if source is a valid file and target does not exist', () => {
      const source = 'source-file.txt';
      const target = 'target-file.txt';

      // Target does not exist
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
      // Source exists
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

      copyFile({ source, target });

      expect(fs.copyFileSync).toHaveBeenCalledWith(source, target, 0);
    });

    test('logs warning if target file already exists', () => {
      const source = 'source-file.txt';
      const target = 'target-file.txt';

      // Target file exists
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      copyFile({ source, target });

      expect(fs.copyFileSync).not.toHaveBeenCalled();
    });
  });

  describe('createPath', () => {
    test('creates a new directory if it does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      createPath({ path: 'test-path' });

      expect(fs.existsSync).toHaveBeenCalledWith('test-path');
      expect(fs.mkdirSync).toHaveBeenCalledWith('test-path', {
        recursive: true,
      });
    });

    test('logs a warning if the directory already exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => true });

      createPath({ path: 'test-path' });

      expect(fs.existsSync).toHaveBeenCalledWith('test-path');
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });
});
