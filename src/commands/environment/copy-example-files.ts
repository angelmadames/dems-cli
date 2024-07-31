import { Command } from 'commander'
import { projectConfig } from '../../config/project.config'
import { copyFile, isDirectory, readPathMatchingFiles } from '../../utils/file-system'
import logger from '../../utils/log'

export function copyExampleFilesCommand() {
  return new Command()
    .name('copy-example-files')
    .summary('Copy example dotenv (.env.example) files on each repo path')
    .action(() => {
      for (const path of projectConfig.reposPaths()) {
        if (!isDirectory(path)) {
          logger.error(`The repository path '${path}' does not yet exist.`)
          logger.error('Did you run `dems setup` or `dems git clone`?')
          process.exit(1);
        }

        const exampleEnvFiles = readPathMatchingFiles(path, '.env.example')

        if (exampleEnvFiles.length > 0) {
          for (const file of exampleEnvFiles) {
            copyFile({
              source: file,
              target: file.replace('.example', ''),
            })
          }
        } else {
          logger.error(`No example env files were found in path: '${path}'`)
          logger.error('Current example files in scope: [.env.example]')
          process.exit(1)
        }
      }
    })
}
