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
    expect(exists).toBeTrue();
  });

  test("isFile returns false if file doesn't exist", () => {
    const exists = isFile('./cli.not.exists.ts');
    expect(exists).toBeFalse();
  });

  test('isDirectory returns true if dir exists', () => {
    const exists = isDirectory('./src');
    expect(exists).toBeTrue();
  });

  test("isDirectory returns false if dir doesn't exist", () => {
    const exists = isDirectory('./src-that-do-not-exist');
    expect(exists).toBeFalse();
  });

  test('createFile & copyFile create and copy a file', () => {
    const file = './test-file.txt';
    const copiedFile = './test-file-copy.txt';
    const content = 'this is a test file';

    // Create and copy file with createFile() and copyFile()
    createFile({ file: file, content: content, verbose: false });
    expect(isFile(file)).toBeTrue();
    copyFile({ source: file, target: copiedFile, verbose: false });
    expect(isFile(copiedFile)).toBeTrue();

    // Ensure files are deleted
    fs.rmSync(file);
    fs.rmSync(copiedFile);
    expect(isFile(file)).toBeFalse();
    expect(isFile(copiedFile)).toBeFalse();
  });
});
