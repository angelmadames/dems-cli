import { setupCommand } from '../src/commands/setup';
import { omitConsoleLogs } from './test-helpers';

const PROJECT = 'test';

export const testSetup = () => {
  omitConsoleLogs();
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

testSetup();
