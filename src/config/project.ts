import { isDirectory, isFile } from '../utils/file-system';
import cliConfig from './cli';
import { defaultConfig, type DEMSProjectConfig } from './dems';
import fs from 'node:fs';

export const projectConfig = (): DEMSProjectConfig => {
  let parsedConfig = defaultConfig;
  const configFile = `${cliConfig.root}/${cliConfig.currentProject}/config.json`;

  if (isFile(configFile)) {
    const config = fs.readFileSync(configFile).toString();
    parsedConfig = JSON.parse(config);
  }
  return parsedConfig;
};

export const projectEnvVars = () => {
  const env = fs.readFileSync(projectConfig().paths.env_file).toString();
  return env;
};
