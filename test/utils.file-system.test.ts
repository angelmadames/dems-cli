import { describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import { copyFile, isDirectory, isFile } from '../src/utils/file-system';

describe('Utils: <file-system>', () => {
  test('isFile, returns true if file exists', () => {
    const exists = isFile('./cli.ts');
    expect(exists).toBeTrue();
  });

  test("isFile, returns false if file doesn't exist", () => {
    const exists = isFile('./cli.not.exists.ts');
    expect(exists).toBeFalse();
  });

  test('isDirectory, returns true if dir exists', () => {
    const exists = isDirectory('./src');
    expect(exists).toBeTrue();
  });

  test("isDirectory, returns false if dir doesn't exist", () => {
    const exists = isDirectory('./src-that-do-not-exist');
    expect(exists).toBeFalse();
  });

  test('copyFile, copies a file', () => {
    const file = './test-file.txt';
    const copiedFile = './test-file-copy.txt';
    const content = 'this is a test file';
    fs.writeFileSync(file, content, 'utf8');
    expect(fs.existsSync(file) && fs.lstatSync(file).isFile()).toBeTrue();

    copyFile(file, copiedFile, false);
    expect(
      fs.existsSync(copiedFile) && fs.lstatSync(copiedFile).isFile(),
    ).toBeTrue();

    fs.rmSync(file);
    fs.rmSync(copiedFile);
    expect(fs.existsSync(file)).toBeFalse();
    expect(fs.existsSync(copiedFile)).toBeFalse();
  });
});
