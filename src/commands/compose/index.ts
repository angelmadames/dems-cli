import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { composeExec } from '../../utils/compose';
import { composeShowArgsCommand } from './show-args';
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
    .addCommand(composeShowArgsCommand())
    .action(() => {
      const config = projectConfig();
      const args = process.argv.slice(3);

      if (args.length === 0) {
        log.error('A Compose command needs to be specified.');
        process.exit(1);
      }

      const result = composeExec({
        cmd: args,
      });
    });

  return command;
};

export default composeCommand();

// Execute script only if called directly
if (import.meta.path === Bun.main) {
  composeCommand().parse();
}
