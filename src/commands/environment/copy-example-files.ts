import { Command } from 'commander'
import { projectConfig } from '../../config/project.config'
import { copyFile, readPathMatchingFiles } from '../../utils/file-system'

export function copyExampleFilesCommand() {
  return new Command()
    .name('copy-example-files')
    .summary('Copy example dotenv files on each repo path')
    .action(() => {
      for (const path of projectConfig.reposPaths()) {
        const exampleEnvFiles = readPathMatchingFiles(path, '.env.example')

        if (exampleEnvFiles.length > 0) {
          for (const file of exampleEnvFiles) {
            copyFile({
              source: file,
              target: file.replace('.example', ''),
            })
          }
        }
      }
    })
}
