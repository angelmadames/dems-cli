import fs from 'node:fs';
import { homedir } from 'node:os';
import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import cliConfig from '../../config/cli';
import { defaultConfig } from '../../config/dems';
import dotEnv from '../../utils/env';
import { createFile, createPath, isFile } from '../../utils/file-system';
import sharedOptions from '../../utils/shared-options';
import { hyphenToUnderscore, noIndent } from '../../utils/string';
import initCommandOptions from './options';
import logger from '../../utils/log';
import { initializeCLI } from './cli';

export const initCommand = () => {
  const command = new Command();
  command
    .name('init')
    .aliases(['configure'])
    .summary('Setup DEMS CLI for a new project')
    .description(
      noIndent(`
        Initializes a new configuration for a new local project using DEMS.
        It generates the default config files and prepares for the setup command.
        The initialization command depends on the Compose files being previously
        setup at every repository specified.
      `),
    )
    .addOption(initCommandOptions.dockerfile)
    .addOption(initCommandOptions.dotEnvFile)
    .addOption(initCommandOptions.interactive)
    .addOption(initCommandOptions.projectName)
    .addOption(sharedOptions.gitOrg)
    .addOption(sharedOptions.gitRef)
    .addOption(sharedOptions.repos)
    .addOption(sharedOptions.reposRoot)
    .action(async (options) => {
      const config = defaultConfig;
      const cli = cliConfig;

      logger.info('Welcome to DEMS!');
      initializeCLI();

      // Project name
      if (options.projectName) {
        config.compose.project_name = options.projectName;
      } else {
        config.compose.project_name = await input({
          message: 'What is the name of project DEMS will manage?',
          default: cli.currentProject || 'demo',
        });
      }

      // Project config root path
      const projectRootPath = `${cli.root}/${config.compose.project_name}`;

      // Respositories root path
      if (options.reposRoot) {
        config.paths.repos_root = options.reposRoot;
      } else {
        config.paths.repos_root = await input({
          message: 'Where would like your repositories to be cloned?',
          default: homedir(),
        });
      }

      // Git organization
      if (options.gitOrg) {
        config.git.org_url = options.gitOrg;
      } else {
        config.git.org_url = await input({
          message: 'What is the URL of the git organization?',
          default: 'git@github.com:gbh-tech',
        });
      }

      // Git repositories
      let repos = '';
      if (options.repos) {
        repos = options.repos;
      } else {
        repos = await input({
          message: 'What are the repos for this project? (comma-sperated)',
          default: 'demo-api,demo-webapp',
        });
      }
      for (const repo of repos.split(',')) {
        config.repositories.push(repo);
        config.paths.repos[hyphenToUnderscore(repo)] =
          `${config.paths.repos_root}/${repo}`;
      }

      // Default git reference
      if (options.gitRef) {
        config.git.default_ref = options.gitRef;
      } else {
        config.git.default_ref = await input({
          message: 'What is the default git reference (branch) to use?',
          default: 'main',
        });
      }

      // Dockerfile path
      if (options.dockerfile) {
        config.dockerfile = options.dockerfile;
      } else {
        config.dockerfile = await input({
          message: 'What would be the Dockerfile default path?',
          default: 'dems.Dockerfile',
        });
      }

      // Project dot env file
      if (options.dotEnv) {
        config.paths.env_file = options.dotEnv;
      } else {
        config.paths.env_file = await input({
          message: 'What is the path for the project config .env file?',
          default: `${projectRootPath}/.env`,
        });
      }

      // Print config JSON to console
      console.log(
        `Config file content: \n${chalk.blue(JSON.stringify(config, null, 2))}`,
      );

      // Confirm config files updates
      let confirmConfigWrite = false;
      let confirmOverride = false;
      const configJson = `${projectRootPath}/config.json`;
      if (options.interactive === 'false') {
        confirmConfigWrite = true;
        confirmOverride = true;
      } else {
        confirmConfigWrite = await confirm({
          message: 'Create config file (.env) using provided values?',
        });
        if (isFile(configJson)) {
          confirmOverride = await confirm({
            message: `Config file: ${configJson} already exists. Overwrite?`,
          });
        }
      }

      // Write or update config files
      if (confirmConfigWrite) {
        fs.writeFileSync(cli.currentProjectFile, config.compose.project_name);
        createPath({ path: projectRootPath });
        createFile({
          file: `${projectRootPath}/config.json`,
          content: JSON.stringify(config, null, 2),
          override: confirmOverride,
        });
        dotEnv.generate(config.dockerfile, config);
      }
    });

  return command;
};

export default initCommand();
