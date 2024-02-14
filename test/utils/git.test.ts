import { describe, expect, test } from 'bun:test';
import Git from '../../src/utils/git';

describe('Utils: git', () => {
  test('should return undefined if repo exists on remote', () => {
    const git = new Git({
      repo: 'https://github.com/gbh-tech/demo-api',
      workingDir: './',
      ref: 'main',
    });
    expect(git.remoteRepoExists()).toBeUndefined();
  });

  test('should throw Error if repo does not exist on remote', () => {
    const git = new Git({
      repo: 'https://github.com/gbh-tech/unknown-repo',
      workingDir: './',
      ref: 'main',
    });

    expect(() => {
      git.remoteRepoExists();
    }).toThrow(Error);
  });
});
