import { spawnSync } from 'bun';
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

export const validateLocalGitRepo = (path: string) => {
  try {
    const gitStatus = spawnSync(['git', 'status'], {
      cwd: path,
    });

    if (gitStatus.exitCode === 0) {
      return;
    }
  } catch (cause) {
    console.error(cause);
    throw new Error(`Local path ${path} is not a valid git repository.`);
  }
};

export const remoteRepoExists = ({ repo }: Pick<GitParams, 'repo'>) => {
  const proc = spawnSync(['git', 'ls-remote', repo], {
    stdin: 'inherit',
  });

  if (proc.exitCode === 0) {
    log.info(`Remote repo: ${repo} is valid.`);
  } else {
    throw new Error(`Remote repo: ${repo} is not valid or does not exist.`);
  }
};

export default git;
