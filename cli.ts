import { Command } from 'commander';
import HelloCommand from './src/commands/hello';
import ConfigCommand from './src/commands/config';

const cli = new Command();

cli
  .name('bun-test-cli')
  .description('CLI test with Bun')
  .version('0.0.1')
  .addCommand(HelloCommand, { isDefault: true })
  .addCommand(ConfigCommand);

cli.parse();
