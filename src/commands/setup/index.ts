import { Command } from 'commander'
import { composeCommand } from '../compose'
import { depsCopyCommand } from '../dependencies/copy'
import { copyExampleFilesCommand } from '../environment/copy-example-files'
import { generateDotEnvCommand } from '../environment/generate-dot-env'
import { gitCloneCommand } from '../git/clone'
import { createProjectCommand } from '../project/create'

export function setupCommand() {
  return new Command()
    .name('setup')
    .alias('init')
    .summary('Setup DEMS for a new project and initialize it')
    .action(async () => {
      await createProjectCommand().parseAsync()
      await gitCloneCommand().parseAsync()

      copyExampleFilesCommand().parse()
      generateDotEnvCommand().parse()

      composeCommand().parse(['build'], { from: 'user' })
      composeCommand().parse(['up -d'], { from: 'user' })

      depsCopyCommand().parse()
    })
}
