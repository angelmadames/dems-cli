import * as fs from 'node:fs';
import { homedir } from 'os';
import * as yaml from 'yaml';
import { composeFiles } from '../utils/compose';
import { isFile } from '../utils/file-system';
import log from '../utils/log';
import cliConfig from './cli';

export type DEMSProjectConfig = {
  compose: {
    project_name: string;
  };
  repositories: string[];
  paths: {
    repositories_root: string;
    data: string;
    env_file: string;
  };
  dockerfile: string;
  git: {
    org_url: string;
    default_ref: string;
  };
};

export const defaultConfig: DEMSProjectConfig = {
  repositories: [],
  paths: {
    repositories_root: '',
    data: '',
    env_file: '',
  },
  dockerfile: '',
  git: {
    org_url: '',
    default_ref: '',
  },
  compose: {
    project_name: '',
  },
};

export const parseDEMSConfigFile = (file: string): DEMSProjectConfig => {
  if (!isFile(file)) {
    log.error(`Config file ${file} is not valid!`);
    log.error('It is not a valid file, or does not exists.');
    process.exit(1);
  }

  return yaml.parse(fs.readFileSync(file, 'utf8'));
};
