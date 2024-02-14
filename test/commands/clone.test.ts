import { describe, expect, test } from 'bun:test';
import { spawnSync } from 'bun';
import { projectConfig } from '../../src/config/project';
import { deletePath } from '../../src/utils/file-system';
import { removeExtraSpaces } from '../../src/utils/string';

describe("Command: 'clone'", () => {
  const config = projectConfig();

  test('Flags (repos-root, git-org, git-ref) parsed correctly', () => {
    const gitRef = 'custom-branch';
    const gitOrgUrl = 'git@github.com/example';
    const reposRoot = './repos';
    const result = spawnSync([
      './cli.ts',
      'clone',
      '--repos-root',
      reposRoot,
      '--git-ref',
      gitRef,
      '--git-org',
      gitOrgUrl,
      '--info',
    ]);
    const output = removeExtraSpaces(result.stdout.toString());

    expect(output).toContain(`Repos path > ${reposRoot}`);
    expect(output).toContain(`Git ref > ${gitRef}`);
    expect(output).toContain(`Git org > ${gitOrgUrl}`);
  });

  test('Clones a repository', () => {
    const reposRoot = './repos';
    const result = spawnSync([
      './cli.ts',
      'clone',
      '--repos',
      'demo-api',
      '--repos',
      'demo-webapp',
      '--repos-root',
      reposRoot,
    ]);

    const out = result.stdout.toString();
    const err = result.stderr.toString();
    deletePath({ path: reposRoot, force: true, verbose: false });
  });
});
