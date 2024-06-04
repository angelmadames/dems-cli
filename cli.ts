#!/usr/bin/env bun

import { Command } from 'commander';
import { configCommand } from './src/commands/config';
import { cleanCommand } from './src/commands/clean';
import { environmentCommand } from './src/commands/environment';
import { composeCommand } from './src/commands/compose';
import { dependenciesCommand } from './src/commands/dependencies';
import { gitCommand } from './src/commands/git';
import { noIndent } from './src/utils/string';
import { name, version, description } from './package.json';
import { projectCommand } from './src/commands/project';

const cli = new Command();

cli
  .name(name)
  .version(version)
  .summary(description)
  .description(noIndent(`
    DEMS is an easy-to-use automation tool to provision development
    environments for compatible application repositories. It uses
    Docker, Docker Compose, and the power of Bun to automate the
    initialization of a project and all of its respositories.
  `))
  .addCommand(projectCommand())
  .addCommand(configCommand())
  .addCommand(gitCommand())
  // .addCommand(cleanCommand())
  // .addCommand(environmentCommand())
  // .addCommand(composeCommand())
  // .addCommand(dependenciesCommand())

cli.parse();
