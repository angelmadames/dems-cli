import { join } from 'node:path'
import { $ } from 'bun'
import cmd from './cmd'
import { createPath, isDirectory } from './file-system'
import type { GitParams } from './interfaces'
import logger from './log'

export const git = {
  clone({ path, repo, ref }: GitParams) {
    if (!isDirectory(path)) createPath({ path })

    const repoPath = join(path, getRepoNameFromURL(repo))

    if (localRepoExists(repoPath)) {
      logger.warn(`Repo ${repo} already cloned.`)
    } else {
      cmd.run(`git -C ${path} clone ${repo} -b ${ref}`)
      logger.info(`Repo '${repo}' was cloned su ccessfully!`)
    }
  },

  async checkout({ path, ref }: Omit<GitParams, 'repo'>) {
    if (!localRepoExists(path)) {
      logger.error(`Repo was not found in path '${path}'.`)
      process.exit(1)
    }

    try {
      logger.info(`Running checkout with ref '${ref}' on repo '${path}'`)
      await $`git -C ${path} checkout ${ref}`
    } catch (error) {
      logger.error(`Could not checkout specified ref '${ref}' on repo '${path}'`)
      logger.error('See above for more info. The ref probably does not exist.')
      process.exit(1);
    }
  },

  branch({ path, ref }: Omit<GitParams, 'repo'>) {
    if (!localRepoExists(path)) {
      logger.error(`${path} is not a valid Git repository.`)
      throw new Error(`Repo not found in ${path}.`)
    }
    cmd.run(`git -C ${path} checkout -b ${ref}`)
    logger.info(`Branch ${ref} was created successfully!`)
  },
}

export function getRepoNameFromURL(gitURL: string): string {
  const name = gitURL.split('/').at(-1) || ''
  return name.replace('.git', '')
}

export function localRepoExists(repoPath: string) {
  return isDirectory(`${repoPath}/.git`)
}

export const validateLocalGitRepo = async (path: string) => {
  const { exitCode } = await $`git -C ${path} status`.quiet()
  if (exitCode === 0) return
  throw new Error(`Local path ${path} is not a valid git repository.`)
}

export const remoteRepoExists = async ({ repo }: Pick<GitParams, 'repo'>) => {
  const { exitCode } = await $`git ls-remote ${repo}`.quiet()

  if (exitCode === 0) {
    logger.info(`Remote repo: ${repo} exists in remote.`)
    return
  }

  throw new Error(`Remote repo: ${repo} is not valid or does not exist.`)
}
