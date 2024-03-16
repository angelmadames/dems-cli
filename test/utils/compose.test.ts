import { describe, expect, mock, test } from 'bun:test';
import { composeFiles } from '../../src/utils/compose.ts';

mock.module('../../src/utils/git.ts', () => ({
  validateLocalGitRepo: () => null,
}));

describe('Utils: compose', () => {
  test('composeFiles returns the correct output', () => {
    const output = composeFiles({
      filesDir: '.dems',
      prefix: 'compose.+.',
      repos: ['frontend', 'backend'],
      reposRoot: '/projects',
    });
    expect(output).toEqual([
      '--file /projects/frontend/.dems/compose-frontend.yml',
      '--file /projects/backend/.dems/compose-backend.yml',
    ]);
  });
});
