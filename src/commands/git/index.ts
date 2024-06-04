import { Command } from 'commander'
import { gitCloneCommand } from './clone'
import { gitCheckoutCommand } from './checkout'
import { gitBranchCommand } from './branch'

export function gitCommand() {
  return new Command()
    .name('git')
    .summary('Convinient git command abstractions for DEMS')
    .addCommand(gitCloneCommand())
    .addCommand(gitCheckoutCommand())
    .addCommand(gitBranchCommand())
}
