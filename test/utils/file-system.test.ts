import { describe, expect, mock, test } from 'bun:test';
import fs from 'node:fs';
import { createFile, isDirectory, isFile } from '../../src/utils/file-system';
import log from '../../src/utils/log';

mock.module('node:fs', () => ({
  default: {
    existsSync: mock(),
    lstatSync: mock(),
    writeFileSync: mock(),
  },
}));

mock.module('../../src/utils/log', () => ({
  default: {
    info: mock(),
    warning: mock(),
    success: mock(),
    dimmedWarning: mock(),
    error: mock(),
  },
}));

describe('Utils: file-system', () => {
  describe('isFile', () => {
    test('returns true if file exists', () => {
      (fs.existsSync as any).mockReturnValue(true);
      (fs.lstatSync as any).mockReturnValue({ isFile: () => true });

      const result = isFile('./cli.ts');

      expect(fs.existsSync).toHaveBeenCalledWith('./cli.ts');
      expect(fs.lstatSync).toHaveBeenCalledWith('./cli.ts');
      expect(result).toBe(true);
    });

    test('returns false if file does not exist', () => {
      (fs.existsSync as any).mockReturnValue(false);
      (fs.lstatSync as any).mockReturnValue({ isFile: () => false });

      const result = isFile('./cli.not.exists.ts');

      expect(fs.existsSync).toHaveBeenCalledWith('./cli.ts');
      expect(fs.lstatSync).toHaveBeenCalledWith('./cli.ts');
      expect(result).toBe(false);
    });
  });

  describe('isDirectory', () => {
    test('returns true if dir exists', () => {
      (fs.existsSync as any).mockReturnValue(true);
      (fs.lstatSync as any).mockReturnValue({ isDirectory: () => true });

      const result = isDirectory('./src');

      expect(fs.existsSync).toHaveBeenCalledWith('./src');
      expect(fs.lstatSync).toHaveBeenCalledWith('./src');
      expect(result).toBe(true);
    });

    test('returns false if dir does not exist', () => {
      (fs.existsSync as any).mockReturnValue(false);
      (fs.lstatSync as any).mockReturnValue({ isDirectory: () => false });

      const result = isDirectory('./src');

      expect(fs.existsSync).toHaveBeenCalledWith('./src');
      expect(fs.lstatSync).toHaveBeenCalledWith('./src');
      expect(result).toBe(false);
    });
  });

  describe('createFile', () => {
    test('should create a new file when it does not exist', () => {
      (fs.existsSync as any).mockReturnValue(false);
      const file = './a-new-file';
      const content = 'hello there from a-new-file';
      createFile({ file, content });

      expect(fs.existsSync).toHaveBeenCalledWith(file);
      expect(fs.writeFileSync).toHaveBeenCalledWith(file, content, 'utf8');
      expect(log.info).toHaveBeenCalledWith(`Creating file: ${file}...`);
      expect(log.success).toHaveBeenCalledWith(
        `File: ${file} successfully created.`,
      );
    });

    test('should override an existing file if override set to true', () => {
      (fs.existsSync as any).mockReturnValue(true);
      (fs.lstatSync as any).mockReturnValue({ isFile: () => true });
      const file = './a-new-file';
      const content = 'hello there from a-new-file';
      createFile({ file, content, override: true });

      expect(fs.existsSync).toHaveBeenCalledWith(file);
      expect(fs.writeFileSync).toHaveBeenCalledWith(file, content, 'utf8');
      expect(log.info).toHaveBeenCalledWith(`Creating file: ${file}...`);
      expect(log.success).toHaveBeenCalledWith(
        `File: ${file} successfully created.`,
      );
      (fs.existsSync as any).mockClear();
      (fs.lstatSync as any).mockClear();
      (fs.writeFileSync as any).mockClear();
    });

    test('should not create a new file if it already exists and override flag is false', () => {
      (fs.existsSync as any).mockReturnValue(true);
      (fs.lstatSync as any).mockReturnValue({ isFile: () => true });
      const file = './a-new-file';
      const content = 'hello there from a-new-file';
      createFile({ file, content, override: false });

      expect(fs.existsSync).toHaveBeenCalledWith(file);
      expect(fs.writeFileSync).not.toHaveBeenCalledWith(file, content, 'utf8');
      expect(log.warning).toHaveBeenCalledWith(`File: ${file} already exists.`);
    });
  });
});
