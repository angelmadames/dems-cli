import fs from 'node:fs';
import { homedir } from 'node:os';
import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import cliConfig from '../../config/cli';
import { defaultConfig, demsEnvVars } from '../../config/dems';
import dotEnv from '../../config/env';
import { createFile, createPath, isFile } from '../../utils/file-system';
import log from '../../utils/log';
import sharedOptions from '../../utils/shared-options';

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
    .option('-e, --dot-env [path]', 'Project config dot env file')
    .option('-d, --dockerfile [dockerfile]', 'Dockerfile needed for dev')
    .addOption(sharedOptions.repos())
    .addOption(sharedOptions.gitOrg())
    .addOption(sharedOptions.reposRoot())
    .addOption(sharedOptions.gitRef())
    .action(async (options) => {
      log.info('Welcome to the DEMS CLI setup process!');
      log.dimmedWarning(
        'If DEMS has been initialized for another project, CLI config files\n' +
          'will not be touched by default. Use --override to re-create them.',
      );
      log.info('Creating initial files for DEMS...');
      createPath({ path: cliConfig.root });
      createFile({ file: cliConfig.file, content: JSON.stringify(cliConfig) });
      createFile({
        file: cliConfig.currentProjectFile,
        content: cliConfig.currentProject,
      });

      const config = defaultConfig;

      const currentProject = await input({
        message: 'What is the name of project DEMS will manage?',
        default:
          demsEnvVars.projectName ||
          options.projectName ||
          cliConfig.currentProject ||
          'demo',
      });
      const projectRootPath = `${cliConfig.root}/${currentProject}`;
      config.compose.project_name = currentProject;

      const reposRoot = await input({
        message: 'Where would like your repositories to be cloned?',
        default: demsEnvVars.reposRoot || options.reposRoot || homedir,
      });
      config.paths.repos_root = reposRoot;

      const gitOrgUrl = await input({
        message: 'What is the URL of the git organization?',
        default:
          demsEnvVars.gitOrgUrl || options.gitOrg || 'git@github.com:gbh-tech',
      });
      config.git.org_url = gitOrgUrl;

      const repos = await input({
        message:
          'What are the repositories for this project? (comma-sperated list)',
        default: demsEnvVars.repos || options.repos || 'demo-api,demo-webapp',
      });
      for (const repo of repos.split(',')) {
        config.repositories.push(repo);
        config.paths.repos[repo] = `${reposRoot.replace('-', '_')}/${repo}`;
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
          `${projectRootPath}/.env`,
      });
      config.paths.env_file = dotEnvFile;

      console.log(
        `Config file content: \n${chalk.blue(JSON.stringify(config, null, 2))}`,
      );

      const confirmConfig = await confirm({
        message: 'Create config file (.env) using provided values?',
      });
      if (confirmConfig) {
        const configJson = `${projectRootPath}/config.json`;

        let confirmOverride = false;
        if (isFile(configJson)) {
          confirmOverride = await confirm({
            message: `Config file: ${configJson} already exists. Override content?`,
            default: false,
          });
        }

        fs.writeFileSync(cliConfig.currentProjectFile, currentProject);
        createPath({ path: projectRootPath });
        createFile({
          file: `${projectRootPath}/config.json`,
          content: JSON.stringify(config, null, 2),
          override: confirmOverride,
        });
        dotEnv.generate(dotEnvFile, config);
      }
    });

  return command;
};

export default setupCommand();
