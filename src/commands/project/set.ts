import { Command } from 'commander';
import CLIConfig from '../../config/cli.config';

export function setActiveProjectCommand() {
  return new Command()
    .name('set')
    .alias('change')
    .summary('Set current active project')
    .argument('<project>', 'The project name to set as active')
    .action((project) => {
      CLIConfig.setActiveProject(project);
    });
}
