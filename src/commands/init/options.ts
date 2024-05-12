import { Option } from 'commander';

export const initCommandOptions = {
  projectName: new Option(
    '-p, --project-name [project-name]',
    'Set project name',
  ),

  dotEnvFile: new Option(
    '-p, --project-name [project-name]',
    'Set project name',
  ),

  dockerfile: new Option(
    '-d, --dockerfile [dockerfile]',
    'Dockerfile needed for dev',
  ),

  interactive: new Option(
    '-i, --interactive [boolean]',
    'Run the command in interactive mode',
  ).default(true),
};

export default initCommandOptions;
