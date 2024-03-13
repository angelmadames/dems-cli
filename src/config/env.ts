import * as fs from 'node:fs';
import log from '../utils/log';
import { flattenObject } from '../utils/object';
import type { DEMSProjectConfig } from './dems';

export const dotEnv = {
  generate(envFilePath: string, config: DEMSProjectConfig): void {
    try {
      const flatConfig = flattenObject(config);
      const envContents = Object.entries(flatConfig)
        .map(([key, value]) => `${key.toUpperCase()}=${value}`)
        .join('\n');

      fs.writeFileSync(envFilePath, envContents);
      log.info(`.env file was generated in: ${config.paths.env_file}.`);
      log.success('Dot env (.env) file generated!');
    } catch (error) {
      console.error(
        'There was an error trying to generate the dot env (.env) file: ',
        error,
      );
    }
  },
};

export default dotEnv;
