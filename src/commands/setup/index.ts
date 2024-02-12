import fs from 'node:fs';
import { homedir } from 'node:os';
import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import yaml from 'yaml';
import cliConfig from '../../config/cli';
import {
  type DEMSProjectConfig,
  defaultConfig,
  demsEnvVars,
} from '../../config/dems';
import dotEnv from '../../config/env';
import { createFile, createPath } from '../../utils/file-system';
import log from '../../utils/log';

export const setupCommand = () => {
  const command = new Command();
  command
    .name('setup')
    .aliases(['init', 'configure'])
    .summary('Setup DEMS CLI for a new project')
    .description(
      'Initializes a new configuration for a new local project using DEMS.\n' +
        'It generates the default config files and prepares for the setup command.\n' +
        'The initialization command depends on the Compose files being previously\n' +
        'setup at every repository specified.',
    )
    .option('-p, --project-name [project-name]', 'Set project name')
    .option('-z, --git-org [git-org]', 'Git organization URL for repositories')
    .option('-o, --repos-root-path [root-path]', 'Repositories root path')
    .option('-r, --repo [repo...]', 'Set project repositories')
    .option('-g, --git-ref [ref]', 'Git default ref')
    .option('-e, --dot-env [path]', 'Project config dot env file')
    .option('-d, --dockerfile [dockerfile]', 'Dockerfile needed for dev')
    .option(
      '-t, --data-path [path]',
      'Directory for all project persistent data',
    )
    .action(async (options) => {
      log.info('Welcome to the DEMS CLI setup process!');
      log.warning(
        '⚠️ If DEMS has been initialized for another project, CLI config files\n' +
          'will not be touched by default. Use --override to re-create them.',
      );

      log.info('Creating initial files for DEMS...');
      createPath(cliConfig.root);
      createFile(cliConfig.file, yaml.stringify(cliConfig));
      createFile(cliConfig.currentProjectFile, cliConfig.currentProject);

      const config = defaultConfig;

      const currentProject = await input({
        message: 'What is the name of project DEMS will manage?',
        default: demsEnvVars.projectName || options.projectName || 'demo',
      });
      fs.writeFileSync(cliConfig.currentProjectFile, currentProject);
      createPath(`${cliConfig.root}/${cliConfig.currentProject}`);
      config.compose.project_name = currentProject;

      const repositoriesRoot = await input({
        message: 'Where would like your repositories to be cloned?',
        default: demsEnvVars.reposRoot || options.reposRootPath || homedir,
      });
      config.paths.repositories_root = repositoriesRoot;

      const gitOrgUrl = await input({
        message: 'What is the URL of the git organization?',
        default:
          demsEnvVars.gitOrgUrl || options.gitOrg || 'git@github.com:gbh-tech',
      });
      config.git.org_url = gitOrgUrl;

      const repos = await input({
        message:
          'What are the repositories for this project? (comma-sperated list)',
        default: demsEnvVars.repos || options.repo || 'demo-api,demo-web',
      });
      for (const repo of repos.split(',')) {
        config.repositories.push(repo);
      }

      const gitRef = await input({
        message: 'What is the default git reference (branch) to use?',
        default: demsEnvVars.gitDefaultRef || options.gitRef || 'main',
      });
      config.git.default_ref = gitRef;

      const dockerfile = await input({
        message: 'What would be the Dockerfile default path?',
        default:
          demsEnvVars.dockerfile || options.dockerfile || 'dems.Dockerfile',
      });
      config.dockerfile = dockerfile;

      const dotEnvFile = await input({
        message: 'What is the path for the project config .env file?',
        default:
          demsEnvVars.envFilePath ||
          options.dotEnv ||
          `${cliConfig.root}/${cliConfig.currentProject}/.env`,
      });
      config.paths.env_file = dotEnvFile;

      const dataPath = await input({
        message:
          'What would be the directory to store all project persistent data?',
        default:
          demsEnvVars.dataPath ||
          options.dataPath ||
          `${cliConfig.root}/${cliConfig.currentProject}/data`,
      });
      config.paths.data = dataPath;

      console.log(
        `Config file content: \n${chalk.blue(JSON.stringify(config, null, 2))}`,
      );

      const confirmConfig = await confirm({
        message: 'Create config file (.env) using provided values?',
      });
      if (confirmConfig) {
        dotEnv.generate(dotEnvFile, config);
      }
    });

  return command;
};

export default setupCommand();
