import * as fs from 'node:fs';
import { homedir } from 'os';
import * as yaml from 'yaml';
import { composeFiles } from '../utils/compose';
import { isFile } from '../utils/file-system';
import log from '../utils/log';
import cliConfig from './cli';

type DEMSConfigType = {
  compose: {
    project_name: string;
    files: string;
  };
  repositories: string[];
  paths: {
    repositories_root: string;
    data: string;
    project_root: string;
    config_file: string;
    env_file: string;
  };
  dockerfile: string;
  git: {
    org_url: string;
    default_ref: string;
  };
};

export const parseDEMSConfigFile = (configFile: string): DEMSConfigType => {
  if (!isFile(configFile)) {
    log.error(`Config file ${configFile} is not valid!`);
    log.error('It is not a valid file, or does not exists.');
    process.exit(1);
  }

  return yaml.parse(fs.readFileSync(configFile, 'utf8'));
};

class Config {
  config: DEMSConfigType = parseDEMSConfigFile(
    process.env.DEMS_CONFIG_FILE ?? cliConfig.file,
  );

  constructor() {
    this.config = {
      ...this.config,
      paths: {
        ...this.config.paths,
        repositories_root: String(homedir),
        project_root: `${cliConfig.root}/${cliConfig.currentProject}`,
        config_file: cliConfig.file,
        env_file: `${cliConfig.root}/${cliConfig.currentProject}/.env`,
      },
    };
  }
}

export default new Config().config;
