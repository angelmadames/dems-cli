#!/usr/bin/env bun

import { Command } from 'commander';
import { configCommand } from './src/commands/config';
import { initCommand } from './src/commands/init';

const cli = new Command();

cli
  .name('dems-cli')
  .description('DEMS (Development Environment Management System) CLI')
  .version('0.0.1')
  .addCommand(configCommand())
  .addCommand(initCommand(), { isDefault: true })

cli.parse();
