import { createPath, isDirectory } from './file-system';
import type { GitParams } from './interfaces';
import log from './log';

export default class Git {
  repoUrl: string;
  repoPath: string;
  gitRef: string;

  constructor({ repo, workingDir, ref }: GitParams) {
    this.repoPath = `${workingDir}/${repo.split('/').pop()}`;
    this.repoUrl = repo;
    this.gitRef = ref;
  }

  clone({ workingDir, repo, ref }: GitParams) {
    createPath({ path: workingDir, verbose: false });
    if (localRepoExists(this.repoPath)) {
      log.warning(`Repo ${repo} already cloned.`);
    } else {
      Bun.spawnSync(['git', 'clone', `${repo}.git`, '-b', ref], {
        stdin: 'inherit',
        cwd: workingDir,
      });

      log.success(`Repo ${repo} was cloned successfully!`);
    }
  }

  checkout({ workingDir, ref }: Pick<GitParams, 'workingDir' | 'ref'>) {
    if (!localRepoExists(workingDir)) {
      log.error(`Repo does not exist at: ${workingDir}`);
      throw new Error('Repo not found.');
    }
    Bun.spawnSync(['git', `-C ${workingDir}`, 'checkout', `${ref}`]);
    log.success(`Repo was checked out to ref ${ref} successfully!`);
  }

  remoteRepoExists(repo: string = this.repoUrl, verbose = false) {
    const proc = Bun.spawnSync(['git', 'ls-remote', repo], {
      stdin: 'inherit',
    });

    if (proc.exitCode === 0) {
      if (verbose) log.info(`Remote repo: ${repo} is valid.`);
    } else {
      throw new Error(`Remote repo: ${repo} is not valid or does not exist.`);
    }
  }
}

export const localRepoExists = (path: string) => {
  return isDirectory(`${path}/.git`);
};

export const validateLocalGitRepo = (path: string) => {
  try {
    const gitStatus = Bun.spawnSync(['git', 'status'], {
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
