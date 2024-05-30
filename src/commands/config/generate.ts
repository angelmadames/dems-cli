import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'

export function generateConfigCommand() {
  return new Command()
    .name('generate')
    .alias('create')
    .summary('Generates default DEMS config file')
    .action(() => {
      cliConfig.save(cliConfig.default())
    })
}
