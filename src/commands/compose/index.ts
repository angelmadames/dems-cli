import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { composeExec } from '../../utils/compose';
import log from '../../utils/log';
import { composeShowArgsCommand } from './show-args';

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
    .addCommand(composeShowArgsCommand())
    .argument('[composeArgs...]', 'Compose arguments to use')
    .allowUnknownOption()
    .action((composeArgs) => {
      const config = projectConfig();

      if (composeArgs.length === 0) {
        log.error('A Compose command needs to be specified.');
        process.exit(1);
      }

      composeExec({
        cmd: composeArgs,
      });
    });

  return command;
};

export default composeCommand();

// Execute script only if called directly
if (import.meta.path === Bun.main) {
  composeCommand().parse();
}
