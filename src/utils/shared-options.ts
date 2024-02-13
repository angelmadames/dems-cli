import type { sha } from 'bun';
import { Option } from 'commander';

export const sharedOptions = {
  gitRef() {
    return new Option(
      '-g, --git-ref [ref]',
      'Git default ref (commit SHA, branch or tag)',
    );
  },
};

export default sharedOptions;
