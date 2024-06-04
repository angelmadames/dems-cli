import { Command } from 'commander'
import { gitBranchCommand } from './branch'
import { gitCheckoutCommand } from './checkout'
import { gitCloneCommand } from './clone'

export function gitCommand() {
  return new Command()
    .name('git')
    .summary('Convinient git command abstractions for DEMS')
    .addCommand(gitCloneCommand())
    .addCommand(gitCheckoutCommand())
    .addCommand(gitBranchCommand())
}
