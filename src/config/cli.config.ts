import fs from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { isFile } from '../utils/file-system'
import logger from '../utils/log'

export const CONFIG_PATH = join(homedir(), '.dems')
export const CONFIG_FILE_PATH = join(CONFIG_PATH, 'config.json')
export const ACTIVE_PROJECT_FILE = join(CONFIG_PATH, 'active-project')
export const DEMS_REPOS_PATH = join(homedir(), 'repos')

export interface CLIConfigSpec {
  // The system path where all DEMS-related files will live.
  // It will be used to store config and data files.
  rootPath: string

  // The DEMS config file (config.json). Relative to DEMS root path.
  configFile: string

  // Active project file is read by DEMS to determine the current project.
  activeProjectFile: string

  // The path where all git repositories will be cloned by DEMS.
  reposPath: string
}

export const cliConfig = {
  default(): CLIConfigSpec {
    return {
      rootPath: CONFIG_PATH,
      configFile: CONFIG_FILE_PATH,
      activeProjectFile: ACTIVE_PROJECT_FILE,
      reposPath: DEMS_REPOS_PATH,
    }
  },

  activeProject(activeProjectFile = ACTIVE_PROJECT_FILE) {
    this.check(activeProjectFile)
    return fs.readFileSync(activeProjectFile).toString()
  },

  setActiveProject(project: string) {
    this.check(ACTIVE_PROJECT_FILE)
    fs.writeFileSync(ACTIVE_PROJECT_FILE, project)
    logger.info(`Active project set to: '${project}'`)
  },

  load(): CLIConfigSpec {
    if (isFile(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')
      return JSON.parse(data) as CLIConfigSpec
    }

    logger.error(
      `DEMS CLI config file does not exist or could not be found at ${CONFIG_PATH}.`,
    )
    logger.error('Did you run `dems install`?')
    process.exit(1)
  },

  get(configFile = CONFIG_FILE_PATH): CLIConfigSpec {
    this.check(CONFIG_FILE_PATH)
    return JSON.parse(fs.readFileSync(configFile).toString())
  },

  save(config: CLIConfigSpec) {
    if (isFile(CONFIG_FILE_PATH)) {
      logger.error('New DEMS CLI config file could not be created.')
      logger.error('Config file already exists!')
      process.exit(1)
    }

    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2))
  },

  check(configFile = CONFIG_FILE_PATH) {
    if (isFile(configFile)) return
    logger.warn('DEMS config file does not exist or is not a valid file.')
    logger.warn("Run 'dems install' or 'dems config generate' to create it.")
    process.exit(1)
  },
}
