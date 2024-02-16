#!/usr/bin/env bun

import { Command } from 'commander';
import { configCommand } from './src/commands/config';
import { setupCommand } from './src/commands/setup';
import { cloneCommand } from './src/commands/clone';
import { cleanCommand } from './src/commands/clean';
import { environmentCommand } from './src/commands/environment';

const cli = new Command();

cli
  .name('dems-cli')
  .description('DEMS (Development Environment Management System) CLI')
  .version('0.0.1')
  .addCommand(configCommand())
  .addCommand(setupCommand())
  .addCommand(cloneCommand())
  .addCommand(cleanCommand())
  .addCommand(environmentCommand())

cli.parse();
