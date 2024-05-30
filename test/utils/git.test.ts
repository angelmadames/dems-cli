import { describe, expect, type jest, test } from 'bun:test'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import git, {
  getRepoName,
  getRepoPath,
  localRepoExists,
  remoteRepoExists,
  validateLocalGitRepo,
} from '../../src/utils/git'

describe('Utils: git', () => {
  describe('clone', () => {
    test('clones the repo if it does not exist locally', () => {
      const path = 'test-path'
      const repo = 'test-repo'
      const ref = 'main'
      ;(fs.existsSync as jest.Mock).mockReturnValueOnce(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValueOnce({
        isDirectory: () => true,
      })
      ;(fs.existsSync as jest.Mock).mockReturnValueOnce(false)
      ;(fs.lstatSync as jest.Mock).mockReturnValueOnce({
        isDirectory: () => false,
      })

      git.clone({ path, repo, ref })

      expect(fs.existsSync).toHaveBeenLastCalledWith('test-path/test-repo/.git')
      expect(fs.lstatSync).toHaveBeenLastCalledWith(path)
      expect(execSync).toHaveBeenCalledWith(
        'git -C test-path clone test-repo.git -b main',
        {
          stdio: 'inherit',
          encoding: 'utf-8',
        },
      )
    })

    test('does not clone the repo if it exists locally', () => {
      const path = 'test-path'
      const repo = 'test-repo'
      const ref = 'main'
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => true })

      git.clone({ path, repo, ref })

      expect(fs.existsSync).toHaveBeenLastCalledWith('test-path/test-repo/.git')
      expect(fs.lstatSync).toHaveBeenLastCalledWith('test-path/test-repo/.git')
      expect(execSync).not.toHaveBeenCalled()
    })
  })

  describe('checkout', () => {
    test('checkout the repo to the specified ref', () => {
      const path = 'test-path/test-repo'
      const ref = 'main'
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({
        isDirectory: () => true,
      })

      git.checkout({ path, ref })

      expect(fs.existsSync).toHaveBeenLastCalledWith(`${path}/.git`)
      expect(fs.lstatSync).toHaveBeenLastCalledWith(`${path}/.git`)
      expect(execSync).toHaveBeenCalledWith(`git -C ${path} checkout ${ref}`, {
        stdio: 'inherit',
        encoding: 'utf-8',
      })
    })

    test('does not checkout the repo if repo is not valid', () => {
      const path = 'test-path/test-repo'
      const ref = 'main'
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({
        isDirectory: () => false,
      })

      expect(() => git.checkout({ path, ref })).toThrow(Error)
      expect(execSync).not.toHaveBeenCalled()
    })
  })

  describe('branch', () => {
    test('creates a new branch in the repo', () => {
      const path = 'test-path/test-repo'
      const ref = 'test-branch'
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValue({
        isDirectory: () => true,
      })

      git.branch({ path, ref })

      expect(fs.existsSync).toHaveBeenLastCalledWith(`${path}/.git`)
      expect(fs.lstatSync).toHaveBeenLastCalledWith(`${path}/.git`)
      expect(execSync).toHaveBeenCalledWith(
        `git -C ${path} checkout -b ${ref}`,
        {
          stdio: 'inherit',
          encoding: 'utf-8',
        },
      )
    })
  })

  describe('gitUtils', () => {
    test('get repo name from full repository name', () => {
      const repo = 'org/repo'
      expect(getRepoName({ repo })).toBe('repo')
    })

    test('get repo root path from full repository path and name', () => {
      const repo = 'org/repo'
      const path = '/root/path'
      expect(getRepoPath({ repo, path })).toBe('/root/path/repo')
    })

    test('returns true if local repo exists', () => {
      const path = '/root/path/repo'
      ;(fs.existsSync as jest.Mock).mockReturnValueOnce(true)
      ;(fs.lstatSync as jest.Mock).mockReturnValueOnce({
        isDirectory: () => true,
      })

      const repoExists = localRepoExists({ path })

      expect(fs.existsSync).toHaveBeenCalledWith(`${path}/.git`)
      expect(fs.lstatSync).toHaveBeenCalledWith(`${path}/.git`)
    })

    test('throws an error if the path is not a valid git repository', () => {
      const path = '/path/to/repo'
      expect(async () => await validateLocalGitRepo(path)).toThrow(Error)
    })

    test('throws an error if the remote git repository does not exist', () => {
      const repo = 'git@github.com/no-org/no-repo.git'
      expect(async () => await remoteRepoExists({ repo })).toThrow(Error)
    })
  })
})
