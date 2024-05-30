import { Command } from 'commander'
import { cliConfig } from '../../config/cli.config'

export function viewConfigCommand() {
  return new Command()
    .name('view')
    .aliases(['get', 'show'])
    .summary('Shows the DEMS config file ')
    .action(() => {
      console.log(cliConfig.get())
    })
}
