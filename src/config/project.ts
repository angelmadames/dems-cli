import cliConfig from './cli';
import type { DEMSProjectConfig } from './dems';
import fs from 'node:fs';

export const projectConfig = (): DEMSProjectConfig => {
  const config = fs
    .readFileSync(`${cliConfig.root}/${cliConfig.currentProject}/config.json`)
    .toString();
  const parsedConfig: DEMSProjectConfig = JSON.parse(config);
  return parsedConfig;
};

export const projectEnvVars = () => {
  const env = fs.readFileSync(projectConfig().paths.env_file).toString();
  return env;
};
