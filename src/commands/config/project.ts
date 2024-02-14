import { Command } from 'commander';
import { projectConfig, projectEnvVars } from '../../config/project';

export const projectConfigCommand = () => {
  const command = new Command();
  command
    .name('project')
    .summary('Current project configuration')
    .description('Manage the current project config & environment variables')
    .option('-e, --env', 'Show environment variables for project (from .env)')
    .option('-j, --json', 'Show configuration values (from config.json)', true)
    .action((options) => {
      if (options.env) {
        console.log(projectEnvVars());
        process.exit(0);
      }

      if (options.json) {
        console.log(projectConfig());
        process.exit(0);
      }
    });

  return command;
};

export default projectConfigCommand();
