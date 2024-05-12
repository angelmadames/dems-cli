import { Command } from 'commander';
import { projectConfig } from '../../config/project';
import { composeExec } from '../../utils/compose';

export const depsCopyCommand = () => {
  const command = new Command();

  command
    .name('copy')
    .summary('Copy dependencies from containers to local repository')
    .description(
      'Copy dependencies from containers to local repository to enable\n' +
        'IDE features such as IntelliSense.',
    )
    .action(() => {
      const config = projectConfig();
      for (const repo of config.repositories) {
        composeExec({
          command: [
            'cp',
            `${repo.replace(
              `${config.compose.project_name}-`,
              '',
            )}:/usr/app/node_modules`,
            `${config.paths.repos[repo.replace('-', '_')]}/node_modules`,
          ],
        });
      }
    });

  return command;
};

export default depsCopyCommand();
