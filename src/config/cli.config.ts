import { homedir } from 'node:os';

type CLIConfig = {
  // The system path where all DEMS-related files will live.
  // Defaults to '~/.dems'.
  rootPath: string;

  // The DEMS' files path in the application repository that DEMS will use.
  // Defaults to '.dems'.
  repoDemsFilesPath: string;
};

const config = {
  cli: {
    rootPath: process.env.DEMS_CLI_ROOT_PATH ?? `${homedir()}/.dems`,
    configPath:
      process.env.DEMS_CLI_CONFIG_FILE ?? `${homedir()}/.dems/config.json`,
    activeProject:
      process.env.DEMS_CLI_ACTIVE_PROJECT ??
      `${homedir()}/.dems/active-project`,
  },
};
