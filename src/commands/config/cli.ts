import { Command } from 'commander';
import { createFile, createPath } from '../../utils/file-system';
import cliConfig from '../../config/cli';
import yaml from 'yaml';
import log from '../../utils/log';

const ConfigCLICommand = new Command();

ConfigCLICommand
  .name('cli')
  .summary('Manage DEMS CLI config')
  .description('Manage the DEMS CLI config')
  .option('-g, --generate', 'Generate CLI config file')
  .action((options) => {
    if (options.generate) {
      createPath(cliConfig.root);
      createFile(cliConfig.file, yaml.stringify(cliConfig));
      createFile(cliConfig.currentProjectFile, cliConfig.currentProject);
    } else {
      log.info(yaml.stringify(cliConfig));
    }
  });

export default ConfigCLICommand;
