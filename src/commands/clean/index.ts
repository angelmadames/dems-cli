import { Command } from 'commander'
import { noIndent } from '../../utils/string'
import { cleanDepsCommand } from './deps'
import { cleanDotEnvCommand } from './dot-env'
import { cleanReposCommand } from './repos'
import { cleanAllCommand } from './all'
import { cleanComposeServicesCommand } from './compose-services'

export function cleanCommand() {
  return new Command()
    .name('clean')
    .summary('Cleanup DEMS-managed resources')
    .description(
      noIndent(`
        Cleans all configured resources and services initialized
        by DEMS. Resets your local development environment.
      `),
    )
    .addCommand(cleanDepsCommand())
    .addCommand(cleanDotEnvCommand())
    .addCommand(cleanReposCommand())
    .addCommand(cleanComposeServicesCommand())
    .addCommand(cleanAllCommand())
}
