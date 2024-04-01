import { $ } from 'bun';
import cmd from './cmd';
import { createPath, isDirectory } from './file-system';
import type { GitParams } from './interfaces';
import log from './log';

const git = {
  clone({ path, repo, ref }: GitParams) {
    if (!isDirectory(path)) createPath({ path });
    const repoPath = getRepoPath({
      path,
      repo,
    });
    if (localRepoExists({ path: repoPath })) {
      log.warning(`Repo ${repo} already cloned.`);
    } else {
      cmd.run(`git -C ${path} clone ${repo}.git -b ${ref}`);
      log.success(`Repo ${repo} was cloned successfully!`);
    }
  },

  checkout({ path, ref }: Omit<GitParams, 'repo'>) {
    if (!localRepoExists({ path })) {
      log.error(`${path} is not a valid Git repository.`);
      throw new Error(`Repo not found in ${path}.`);
    }
    cmd.run(`git -C ${path} checkout ${ref}`);
    log.success(`Repo was checked out to ref ${ref} successfully!`);
  },

  branch({ path, ref }: Omit<GitParams, 'repo'>) {
    if (!localRepoExists({ path })) {
      log.error(`${path} is not a valid Git repository.`);
      throw new Error(`Repo not found in ${path}.`);
    }
    cmd.run(`git -C ${path} checkout -b ${ref}`);
    log.success(`Branch ${ref} was created successfully!`);
  }
};

export const getRepoName = ({ repo }: Pick<GitParams, 'repo'>) => {
  return repo.split('/').pop();
};

export const getRepoPath = ({ path, repo }: Omit<GitParams, 'ref'>): string => {
  return `${path}/${getRepoName({ repo })}`;
};

export const localRepoExists = ({ path }: Pick<GitParams, 'path'>) => {
  return isDirectory(`${path}/.git`);
};

export const validateLocalGitRepo = async (path: string) => {
  const { exitCode } = await $`git -C ${path} status`.quiet();

  if (exitCode === 0) {
    log.info(`Local repo: ${path} exists and is valid.`);
    return;
  }

  throw new Error(`Local path ${path} is not a valid git repository.`);
};

export const remoteRepoExists = async ({ repo }: Pick<GitParams, 'repo'>) => {
  const { exitCode } = await $`git ls-remote ${repo}`.quiet();

  if (exitCode === 0) {
    log.info(`Remote repo: ${repo} exists in remote.`);
    return;
  }

  throw new Error(`Remote repo: ${repo} is not valid or does not exist.`);
};

export default git;
