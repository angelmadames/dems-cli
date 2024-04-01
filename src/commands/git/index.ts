import { Command } from 'commander';
import { gitCheckoutCommand } from './checkout';
import { gitCloneCommand } from './clone';
import { gitBranchCommand } from './branch';

export const gitCommand = () => {
  const command = new Command();

  command
    .name('git')
    .description('All git commands abstracted by DEMS')
    .addCommand(gitCloneCommand())
    .addCommand(gitCheckoutCommand())
    .addCommand(gitBranchCommand())

  return command;
};

export default gitCommand();
