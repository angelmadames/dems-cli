import { join } from 'node:path'
import { Command } from 'commander'
import { projectConfig } from '../../config/project.config'
import { copyFile } from '../../utils/file-system'

export function copyExampleFilesCommand() {
  return new Command()
    .name('copy-example-files')
    .summary('Copy example files from the ')
    .action(() => {
      for (const path of projectConfig.reposPaths()) {
        copyFile({
          source: join(path, '.env.example'),
          target: join(path, '.env'),
        })
      }
    })
}
