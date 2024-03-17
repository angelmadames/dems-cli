import { Option } from 'commander';

export const sharedOptions = {
  info() {
    return new Option(
      '-i, --info',
      'Only print info to console about command',
    ).default(false);
  },
  gitRef() {
    return new Option(
      '-g, --git-ref [ref]',
      'Git default ref (commit SHA, branch or tag)',
    );
  },
  reposRoot() {
    return new Option(
      '-o, --repos-root [path]',
      'Repositories root where they will be cloned',
    );
  },
  gitOrg() {
    return new Option(
      '-z, --git-org [git-org]',
      'Git organization URL for repositories',
    );
  },
  repos() {
    return new Option(
      '-r, --repos [repos]',
      'Git repositories to manage/operate',
    );
  },
  force() {
    return new Option(
      '-f, --force',
      'Prevents user interactivity and assumes default values',
    ).default(false);
  },
};

export default sharedOptions;
