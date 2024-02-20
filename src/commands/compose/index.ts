import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { compose, composeFiles, composeSettings } from '../../utils/compose';
import { isFile } from '../../utils/file-system';
import log from '../../utils/log';

export const composeCommand = () => {
  const command = new Command();
  const config = projectConfig();

  command
    .name('compose')
    .summary('Container orchestration command for DEMS')
    .description(
      'Aids in container orchestration for services in DEMS.\n' +
        'Uses Compose under the hood.',
    )
    .option('-z, --show-compose-string', 'Shows the Composo files string')
    .action(async (options) => {
      const config = projectConfig();
      const args = process.argv.slice(3);

      const composeFilesString = composeFiles({
        prefix: 'compose',
        filesDir: '.dems',
      });

      let composeEnvFilesString = '';
      for (const repo of config.repositories) {
        const envFile = `${config.paths.repos_root}/${repo}/.env`;
        if (isFile(envFile)) {
          composeEnvFilesString += ` --env-file ${envFile}`;
        }
      }

      const composeString = composeFilesString
        .concat(composeSettings())
        .concat(composeEnvFilesString.trimEnd());

      if (options.showComposeString) {
        console.log(composeString);
        return;
      }

      if (args.length === 0) {
        log.error('A Compose command needs to be specified.');
        process.exit(1);
      }

      console.log(args);
      if (args[0] === 'build') {
        const result = compose({
          args: composeString,
          cmd: 'build',
        });
        console.log(result.exitCode);
        console.log(result.stderr.toString());
      }
      if (args[0] === 'config') {
        const result = compose({
          args: composeString,
          cmd: 'config',
        });
        console.log(result.exitCode);
        console.log(result.stderr.toString());
        console.log(result.stdout.toString());
      }
    });

  return command;
};

export default composeCommand();

// Execute script only if called directly
if (import.meta.path === Bun.main) {
  composeCommand().parse(process.argv);
}
