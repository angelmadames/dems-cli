import { beforeEach, describe, expect, jest, mock, test } from 'bun:test';
import fs from 'node:fs';
import cmd from '../../src/utils/cmd';
import git, { localRepoExists } from '../../src/utils/git';
import log from '../../src/utils/log';

mock.module('node:fs', () => ({
  default: {
    existsSync: mock(),
    lstatSync: mock(),
    mkdirSync: mock(),
  },
}));

mock.module('../../src/utils/log', () => ({
  default: {
    info: mock(),
    warning: mock(),
    success: mock(),
    error: mock(),
  },
}));

mock.module('../../src/utils/cmd', () => ({
  default: {
    run: mock(),
    runIt: mock(),
  },
}));

mock.module('../../src/utils/git', () => ({
  localRepoExists: mock(),
}));

describe('Utils: git', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('clone', () => {
    test('clones the repo if it does not exist locally', () => {
      const path = 'test-path';
      const repo = 'test-repo';
      const ref = 'main';

      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => false });
      (localRepoExists as jest.Mock).mockReturnValue(false);

      git.clone({ path, repo, ref });

      expect(localRepoExists).toHaveBeenCalledWith({
        path: 'test-path/test-repo',
      });
      expect(cmd.run).toHaveBeenCalledWith(
        'git -C test-path clone test-repo.git -b main',
      );
      expect(log.success).toHaveBeenCalledWith(
        'Repo test-repo was cloned successfully!',
      );
    });
  });
});
