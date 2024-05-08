#!/usr/bin/env bun

import { Command } from 'commander';
import { configCommand } from './src/commands/config';
import { initCommand } from './src/commands/init';
import { cleanCommand } from './src/commands/clean';
import { environmentCommand } from './src/commands/environment';
import { composeCommand } from './src/commands/compose';
import { dependenciesCommand } from './src/commands/dependencies';
import { gitCommand } from './src/commands/git';
import { noIndent } from './src/utils/string';

const cli = new Command();

cli
  .name('dems-cli')
  .version('0.0.1')
  .summary('DEMS (Development Environment Management System) CLI')
  .description(
    noIndent(`
      DEMS is an easy-to-use automation tool to provision development
      environments for compatible application repositories. It uses
      Docker, Docker Compose, and the power of Bun to automate the
      initialization of a project and all of its respositories.
    `)
  )
  .addCommand(configCommand())
  .addCommand(initCommand())
  .addCommand(gitCommand())
  .addCommand(cleanCommand())
  .addCommand(environmentCommand())
  .addCommand(composeCommand())
  .addCommand(dependenciesCommand())

cli.parse();
