import { Command } from 'commander';
import dotEnv from '../../config/env';
import { projectConfig, projectEnvVars } from '../../config/project';
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
    .action(async (options) => {
      if (options.generateDotEnv) {
        log.info("Generating project's dot env file...");
        dotEnv.generate(config.paths.env_file, config);
      } else {
        console.log(projectEnvVars());
      }
    });

  return command;
};

export default environmentCommand();
