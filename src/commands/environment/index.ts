import { Command } from 'commander';
import { projectConfig, projectEnvVars } from '../../config/project';
import dotEnv from '../../utils/env';
import { copyFile } from '../../utils/file-system';
import log from '../../utils/log';

export const environmentCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('environment')
    .alias('env')
    .summary('Updates application environment config (.env)')
    .description(
      'Apps are run in different environments throughout their development\n' +
        "life cycle. To ensure their configuration matches what's\n" +
        'expected for DEMS, we override some of the default env settings.',
    )
    .option(
      '-g, --generate-dot-env',
      "Generate the dot env file for current project's config.json",
    )
    .option(
      '-c, --copy-example-files',
      "Copy the .env.example file of the current project's repositories",
    )
    .action(async (options) => {
      const config = projectConfig();

      if (options.copyExampleFiles) {
        for (const repo of config.repositories) {
          const repoPath = `${config.paths.repos_root}/${repo}`;
          copyFile({
            source: `${repoPath}/.env.example`,
            target: `${repoPath}/.env`,
          });
        }
        return;
      }

      if (options.generateDotEnv) {
        log.info("Generating project's dot env file...");
        dotEnv.generate(config.paths.env_file, config);
        return;
      }

      console.log(projectEnvVars());
    });

  return command;
};

export default environmentCommand();
