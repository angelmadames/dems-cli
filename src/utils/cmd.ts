import { execSync } from 'node:child_process'
import { removeExtraSpaces } from './string'

export const cmd = {
  run: (command: string) => {
    execSync(removeExtraSpaces(command), {
      stdio: 'inherit',
      encoding: 'utf-8',
    })
  },
  runIt: (command: string) => {
    return execSync(removeExtraSpaces(command), { encoding: 'utf-8' })
  },
}

export default cmd
