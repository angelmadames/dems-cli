import fs from 'fs';
import log from '../utils/log.js';
import { flattenObject } from '../utils/object';
import config from './dems';

export const dotEnv = {
  generate(envFilePath = '.env'): void {
    try {
      const flatConfig = flattenObject(config);
      const envContents = Object.entries(flatConfig)
        .map(([key, value]) => `${key.toUpperCase()}=${value}`)
        .join('\n');

      fs.writeFileSync(envFilePath, envContents);
      log.info(
        `.env file was generated in the DEMS config path: ${config.paths.env_file}.`,
      );
      log.success('✅ Dot env (.env) file generated!');
    } catch (error) {
      console.error(
        '❌ There was an error trying to generate the dot env (.env) file: ',
        error,
      );
    }
  },
};

export default dotEnv;
