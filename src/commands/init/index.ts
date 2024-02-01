import fs from 'node:fs';
import { homedir } from 'node:os';
import { confirm, input } from '@inquirer/prompts';
import { Command } from 'commander';
import yaml from 'yaml';
import cliConfig from '../../config/cli';
import { createFile, createPath } from '../../utils/file-system';
import log from '../../utils/log';

export const initCommand = () => {
  const command = new Command();
  command
    .name('init')
    .aliases(['initialize', 'configure', 'new'])
    .summary('Initialize DEMS CLI for a new project')
    .description(
      'Initializes a new configuration for a new local project using DEMS.\n' +
        'It generates the default config files and prepares for the setup command.\n' +
        'The initialization command depends on the Compose files being previously\n' +
        'setup at every repository specified.',
    )
    .option('-p, --project-name [project-name]', 'Set project name')
    .option('-o, --repos-root-path [root-path]', 'Repositories root path')
    .option('-z, --git-org [git-org]', 'Git organization URL for repositories')
    .option('-r, --repo [repo...]', 'Set project repositories')
    .option('-g, --git-ref [ref]', 'Git default ref')
    .option('-d, --dockerfile [dockerfile]', 'Dockerfile needed for dev')
    .action(async (options) => {
      log.info('Welcome to the DEMS CLI initialization process!');
      log.warning(
        '⚠️ If DEMS has been initialized for another project, CLI config files\n' +
          'will not be touched by default. Use --override to re-create them.',
      );

      log.info('Creating initial files for DEMS...');
      createPath(cliConfig.root);
      createFile(cliConfig.file, yaml.stringify(cliConfig));
      createFile(cliConfig.currentProjectFile, cliConfig.currentProject);

      const currentProject = await input({
        message:
          'What is the name of the first project DEMS will manage?\n' +
          '(Leave blank if not sure, can be changed later)',
        default: process.env.DEMS_CURRENT_PROJECT || options.projectName,
      });
      fs.writeFileSync(cliConfig.currentProjectFile, currentProject);

      const repositoriesRoot = await input({
        message: 'Where would like your repositories to be cloned?',
        default:
          process.env.DEMS_REPOS_ROOT_PATH || options.reposRootPath || homedir,
      });
    });

  return command;
};

export default initCommand();
