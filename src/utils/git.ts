import fs from 'node:fs';
import log from './log.js';
import { execSync } from 'node:child_process';
import type { Errorlike, SpawnOptions, Subprocess } from 'bun';
import { removeExtraSpaces } from './string.js';

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
    if (this.repoExists(this.repoPath)) {
      log.warning(`Repo ${repo} already cloned.`);
    } else {
      Bun.spawnSync(['git', 'clone',`${repo}.git`, '-b', ref], {
        stdin: 'inherit',
        cwd: workingDir,
      });
      // gitCommand(`git -C ${workingDir} clone ${repo}.git -b ${ref}`);
      log.success(`Repo ${repo} was cloned successfully!`);
    }
  }

  checkout({ workingDir, ref }: Pick<GitParams, 'workingDir' | 'ref'>) {
    if (!this.repoExists(workingDir)) {
      log.error(`Repo does not exist at: ${workingDir}`);
      throw new Error('Repo not found.');
    }
    Bun.spawnSync(['git', `-C ${workingDir}`, 'checkout', `${ref}`]);
    log.success(`Repo was checked out to ref ${ref} successfully!`);
  }

  repoExists(path: string) {
    return (
      fs.existsSync(`${path}/.git`) &&
      fs.lstatSync(`${path}/.git`).isDirectory()
    );
  }
}
