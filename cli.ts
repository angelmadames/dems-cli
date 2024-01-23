import { Command } from 'commander';
import HelloCommand from './commands/hello';

const cli = new Command();

cli
  .name('bun-test-cli')
  .description('CLI test with Bun')
  .version('0.0.1')
  .addCommand(HelloCommand, { isDefault: true });

cli.parse();
