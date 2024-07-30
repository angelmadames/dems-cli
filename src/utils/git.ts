import { join } from 'node:path'
import { $ } from 'bun'
import { createPath, isDirectory, isFile } from './file-system'
import type { GitParams } from './interfaces'
import logger from './log'

export const git = {
  async clone({ path, repo, ref }: GitParams) {
    createPath({ path })
    checkLocalRepo(join(path, getRepoNameFromURL(repo)))

    await $`git -C ${path} clone ${repo} -b ${ref}`
    logger.info(`Repo '${repo}' was cloned successfully!`)
  },

  async checkout({ path, ref }: Omit<GitParams, 'repo'>) {
    checkLocalRepo(path, true)

    try {
      logger.info(`Running checkout with ref '${ref}' on repo '${path}'`)
      await $`git -C ${path} checkout ${ref}`
    } catch (error) {
      logger.error(
        `Could not checkout specified ref '${ref}' on repo '${path}'`,
      )
      logger.error('See above for more info. The ref probably does not exist.')
      process.exit(1)
    }
  },

  async branch({ path, ref }: Omit<GitParams, 'repo'>) {
    if (!localRepoExists(path)) {
      logger.error(`${path} is not a valid Git repository.`)
      throw new Error(`Repo not found in ${path}.`)
    }
    await $`git -C ${path} checkout -b ${ref}`
    logger.info(`Branch ${ref} was created successfully!`)
  },
}

export function getRepoNameFromURL(url: string) {
  if (url) {
    const name = url.split('/').at(-1)
    if (name) {
      return name.replace('.git', '')
    }
  }

  logger.error(`Could not obtain repo name from passed git URL: '${url}'`)
  process.exit(1)
}

export function checkLocalRepo(repoPath: string, errorIfNotFound = false) {
  if (isDirectory(`${repoPath}/.git`) && isFile(`${repoPath}/.git/index`)) {
    logger.warn(`Repo is already cloned at '${repoPath}'`)
    return true
  }

  if (errorIfNotFound) {
    logger.error(`Repo was not found in path '${repoPath}'.`)
    process.exit(1)
  }

  return false
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
