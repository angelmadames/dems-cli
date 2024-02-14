import { describe, expect, test } from 'bun:test';
import { spawnSync } from 'bun';
import { projectConfig } from '../../src/config/project';
import { removeExtraSpaces } from '../../src/utils/string';

describe("Command: 'clone'", () => {
  const config = projectConfig();

  test('Flags (repos-root, git-org, git-ref) parsed correctly', () => {
    const reposPath = './repos';
    const gitRef = 'custom-branch';
    const gitOrgUrl = 'git@github.com/example';
    const result = spawnSync([
      './cli.ts',
      'clone',
      '--repos-root',
      reposPath,
      '--git-ref',
      gitRef,
      '--git-org',
      gitOrgUrl,
      '--info',
    ]);
    const output = removeExtraSpaces(result.stdout.toString());

    expect(output).toContain(`Repos path > ${reposPath}`);
    expect(output).toContain(`Git ref > ${gitRef}`);
    expect(output).toContain(`Git org > ${gitOrgUrl}`);
  });
});
