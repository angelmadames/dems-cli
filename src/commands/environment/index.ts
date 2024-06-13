import { Command } from 'commander'
import { copyExampleFilesCommand } from './copy-example-files'
import { generateDotEnvCommand } from './generate-dot-env'

export function environmentCommand() {
  return new Command()
    .name('environment')
    .alias('env')
    .summary('Updates application environment config (.env)')
    .addCommand(generateDotEnvCommand())
    .addCommand(copyExampleFilesCommand())
}
