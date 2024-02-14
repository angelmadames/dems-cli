import fs from 'node:fs';
import log from './log.js';

type GitParams = {
  workingDir: string;
  repo: string;
  ref: string;
};

export default class Git {
  repoPath: string;
  gitRef: string;

  constructor({ repo, workingDir, ref }: GitParams) {
    this.repoPath = `${workingDir}/${repo.split('/').pop()}`;
    this.gitRef = ref;
  }

  clone({ workingDir, repo, ref }: GitParams) {
    this.remoteRepoExists(repo);

    if (this.localRepoExists(this.repoPath)) {
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
    if (!this.localRepoExists(workingDir)) {
      log.error(`Repo does not exist at: ${workingDir}`);
      throw new Error('Repo not found.');
    }
    Bun.spawnSync(['git', `-C ${workingDir}`, 'checkout', `${ref}`]);
    log.success(`Repo was checked out to ref ${ref} successfully!`);
  }

  localRepoExists(path: string) {
    return (
      fs.existsSync(`${path}/.git`) &&
      fs.lstatSync(`${path}/.git`).isDirectory()
    );
  }

  remoteRepoExists(repo: string) {
    const proc = Bun.spawnSync(['git', 'ls-remote', repo], {
      stdin: 'inherit',
    });

    if (proc.exitCode === 0) {
      console.log(`Remote repo: ${repo} is valid.`);
    } else {
      throw new Error(`Remote repo: ${repo} is not valid or does not exist.`);
    }
  }
}
