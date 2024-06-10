import { describe, expect, type jest, test } from 'bun:test'
import fs from 'node:fs'
import { confirm } from '@inquirer/prompts'
import {
  copyFile,
  createFile,
  createPath,
  deletePath,
  isDirectory,
  isFile,
} from '../../src/utils/file-system'

describe('Utils: file-system', () => {
  describe('isFile', () => {
    test('returns true if file exists', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValueOnce(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValueOnce({ isFile: () => true })

      expect(isFile('./cli.ts')).toBeTrue()
      expect(fs.existsSync).toHaveBeenCalledWith('./cli.ts')
      expect(fs.lstatSync).toHaveBeenCalledWith('./cli.ts')
    })

    test('returns false if file does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValueOnce(false)

      expect(isFile('./cli.not.exists.ts')).toBeFalse()
      expect(fs.existsSync).toHaveBeenCalledWith('./cli.not.exists.ts')
      expect(fs.lstatSync).not.toHaveBeenCalled()
    })

    test('returns false if path exists but is not a file', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValueOnce(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValueOnce({ isFile: () => false })

      expect(isFile('test-path')).toBeFalse()
      expect(fs.existsSync).toHaveBeenCalledWith('test-path')
      expect(fs.lstatSync).toHaveBeenCalledWith('test-path')
    })
  })

  describe('isDirectory', () => {
    test('returns true if path exists and is a directory', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => true })

      expect(isDirectory('test-path')).toBeTrue()
      expect(fs.existsSync).toHaveBeenCalledWith('test-path')
      expect(fs.lstatSync).toHaveBeenCalledWith('test-path')
    })

    test('returns false if path does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)

      expect(isDirectory('test-path')).toBeFalse()
      expect(fs.existsSync).toHaveBeenCalledWith('test-path')
      expect(fs.lstatSync).not.toHaveBeenCalled()
    })

    test('returns false if path exists but is not a directory', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => false })

      expect(isDirectory('test-path')).toBeFalse()
      expect(fs.existsSync).toHaveBeenCalledWith('test-path')
      expect(fs.lstatSync).toHaveBeenCalledWith('test-path')
    })
  })

  describe('createFile', () => {
    test('creates a new file when it does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)
      const file = './a-new-file'
      const content = 'hello there from a-new-file'
      createFile({ file, content })

      expect(fs.existsSync).toHaveBeenCalledWith(file)
      expect(fs.writeFileSync).toHaveBeenCalledWith(file, content, 'utf8')
    })

    test('overrides an existing file if override set to true', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({ isFile: () => true })
      const file = './a-new-file'
      const content = 'hello there from a-new-file'
      createFile({ file, content, overwrite: true })

      expect(fs.existsSync).toHaveBeenCalledWith(file)
      expect(fs.writeFileSync).toHaveBeenCalledWith(file, content, 'utf8')
    })

    test('does not create a new file if it exists and override is false', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({ isFile: () => true })
      const file = './a-new-file'
      const content = 'hello there from a-new-file'
      createFile({ file, content, overwrite: false })

      expect(fs.existsSync).toHaveBeenCalledWith(file)
      expect(fs.writeFileSync).not.toHaveBeenCalledWith(file, content, 'utf8')
    })
  })

  describe('copyFile', () => {
    test('logs error and throw an error if source is not a valid file', () => {
      // Target & source does not exist
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)
      expect(fs.copyFileSync).not.toHaveBeenCalled()
    })

    test('copies file if source is a valid file and target does not exist', () => {
      const source = 'source-file.txt'
      const target = 'target-file.txt'

      // Target does not exist
      ;(fs.existsSync as jest.Mock).mockReturnValueOnce(false)

      // Source exists
      ;(fs.existsSync as jest.Mock).mockReturnValueOnce(true)

      copyFile({ source, target })

      expect(fs.copyFileSync).toHaveBeenCalledWith(source, target, 0)
    })

    test('logs warning if target file already exists', () => {
      const source = 'source-file.txt'
      const target = 'target-file.txt'

      // Target file exists
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)

      copyFile({ source, target })

      expect(fs.copyFileSync).not.toHaveBeenCalled()
    })
  })

  describe('createPath', () => {
    test('creates a new directory if it does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)

      createPath({ path: 'test-path' })

      expect(fs.existsSync).toHaveBeenCalledWith('test-path')
      expect(fs.mkdirSync).toHaveBeenCalledWith('test-path', {
        recursive: true,
      })
    })

    test('logs a warning if the directory already exists', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => true })

      createPath({ path: 'test-path' })

      expect(fs.existsSync).toHaveBeenCalledWith('test-path')
      expect(fs.mkdirSync).not.toHaveBeenCalled()
    })
  })

  describe('deletePath', () => {
    test('deletes a directory if it exists and force is true', async () => {
      ;(confirm as jest.Mock).mockResolvedValue(true)
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({
        isFile: () => false,
        isDirectory: () => true,
      })

      await deletePath({ path: 'test-dir', force: true })

      expect(fs.existsSync).toHaveBeenCalledWith('test-dir')
      expect(confirm).not.toHaveBeenCalled()
      expect(fs.rmdirSync).toHaveBeenCalledWith('test-dir', {
        recursive: true,
      })
      expect(fs.rmSync).not.toHaveBeenCalled()
    })

    test('deletes a file if it exists and force is true', async () => {
      ;(confirm as jest.Mock).mockResolvedValue(true)
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({
        isFile: () => true,
        isDirectory: () => false,
      })

      await deletePath({ path: 'test-file.txt', force: true })

      expect(fs.existsSync).toHaveBeenCalledWith('test-file.txt')
      expect(confirm).not.toHaveBeenCalled()
      expect(fs.rmdirSync).not.toHaveBeenCalled()
      expect(fs.rmSync).toHaveBeenCalledWith('test-file.txt')
    })

    test('does not delete a directory if force is false and confirmation is not given', async () => {
      ;(confirm as jest.Mock).mockResolvedValue(false)
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({
        isFile: () => false,
        isDirectory: () => true,
      })

      await deletePath({ path: 'test-dir' })

      expect(fs.existsSync).toHaveBeenCalledWith('test-dir')
      expect(confirm).toHaveBeenCalledWith({
        message: 'Delete directory test-dir recursively?',
      })
      expect(fs.rmdirSync).not.toHaveBeenCalled()
      expect(fs.rmSync).not.toHaveBeenCalled()
    })

    test('should not delete a file if force is false and confirmation is not given', async () => {
      ;(confirm as jest.Mock).mockResolvedValue(false)
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({
        isFile: () => true,
        isDirectory: () => false,
      })

      await deletePath({ path: 'test-file.txt' })

      expect(fs.existsSync).toHaveBeenCalledWith('test-file.txt')
      expect(confirm).toHaveBeenCalledWith({
        message: 'Delete file test-file.txt?',
      })
      expect(fs.rmdirSync).not.toHaveBeenCalled()
      expect(fs.rmSync).not.toHaveBeenCalled()
    })
  })
})
