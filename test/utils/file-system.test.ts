import { describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import {
  copyFile,
  createFile,
  isDirectory,
  isFile,
} from '../../src/utils/file-system';

describe('Utils: file-system', () => {
  test('isFile returns true if file exists', () => {
    const exists = isFile('./cli.ts');
    expect(exists).toBe(true);
  });

  test("isFile returns false if file doesn't exist", () => {
    const exists = isFile('./cli.not.exists.ts');
    expect(exists).toBe(false);
  });

  test('isDirectory returns true if dir exists', () => {
    const exists = isDirectory('./src');
    expect(exists).toBe(true);
  });

  test("isDirectory returns false if dir doesn't exist", () => {
    const exists = isDirectory('./src-that-do-not-exist');
    expect(exists).toBe(false);
  });

  test('createFile & copyFile create and copy a file', () => {
    const file = './test-file.txt';
    const copiedFile = './test-file-copy.txt';
    const content = 'this is a test file';

    // Create and copy file with createFile() and copyFile()
    createFile({ file: file, content: content, verbose: false });
    expect(isFile(file)).toBe(true);
    copyFile({ source: file, target: copiedFile, verbose: false });
    expect(isFile(copiedFile)).toBe(true);

    // Ensure files are deleted
    fs.rmSync(file);
    fs.rmSync(copiedFile);
    expect(isFile(file)).toBe(false);
    expect(isFile(copiedFile)).toBe(false);
  });
});
