import { setupCommand } from '../src/commands/setup';
import cliConfig from '../src/config/cli';
import { projectConfig } from '../src/config/project';
import { deletePath } from '../src/utils/file-system';
import { omitConsoleLogs } from './helpers';

const PROJECT = 'test';

export const testSetup = () => {
  // omitConsoleLogs();
  setupCommand().parse([
    ...process.argv,
    '--interactive=false',
    `--project-name=${PROJECT}`,
    `--repos-root=${import.meta.dirname}/repos`,
    '--repos=demo-api,demo-webapp',
    '--git-org=git@github.com:gbh-tech',
    '--git-ref=main',
    '--dot-env=dems.Dockerfile',
    '--dockerfile=test.Dockerfile',
  ]);
};

export const testTeardown = () => {
  if (cliConfig.currentProject === PROJECT) {
    deletePath({ path: `${cliConfig.root}/${PROJECT}`, force: true });
    deletePath({ path: projectConfig().paths.repos_root, force: true });
    deletePath({ path: projectConfig().paths.env_file, force: true });
  }
};
