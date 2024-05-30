import fs from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { createFile, createPath, isFile } from '../utils/file-system'
import logger from '../utils/log'
import { CONFIG_PATH, cliConfig } from './cli.config'

const CURRENT_PROJECT = cliConfig.activeProject()
const PROJECT_CONFIG_ROOT = join(CONFIG_PATH, CURRENT_PROJECT)
const PROJECT_CONFIG_FILE = join(PROJECT_CONFIG_ROOT, 'config.json')

interface ProjectConfigSpec {
  // The project name determines how docker compose services will be prefixed,
  // thus maintaining complete isolation with other services deployed locally.
  // It also servers as a unique reference across DEMS tasks.
  projectName: string

  // The project root path is where DEMS will store project-scoped confguration
  // files. The project root path is by default relative to the DEMS CLI root
  // config path (~/.dems).
  projectRootPath: string

  // The project config file (config.json). Relative to project root path.
  configFile: string

  // The Dockerfile name used by DEMS for the project. The location of the
  // Dockerfile is expected by DEMS in the application's repository DEMS
  // files directory.
  dockerfile: string

  // The repositories object is a refernce to the application repositories,
  // their names (key) and path (value). This is required for DEMS to be aware
  // of the desired state of applications to be managed.
  repositories: { [key: string]: string }

  // The `git` object contains all configuration values for Git resources.
  git: {
    // The git organization where all repos referenced by DEMS are found.
    org: string
    // The default git reference (branch, tag, commit) used to clone the repos.
    defaultRef: string
  }
}

const projectConfig = {
  default(): ProjectConfigSpec {
    return {
      projectName: 'demo',
      projectRootPath: PROJECT_CONFIG_ROOT,
      configFile: PROJECT_CONFIG_FILE,
      dockerfile: 'Dockerfile',
      repositories: {
        'demo-api': join(homedir(), 'repos', 'demo', 'demo-api'),
        'demo-webapp': join(homedir(), 'repos', 'demo', 'demo-api'),
      },
      git: {
        org: 'gbh-tech',
        defaultRef: 'main',
      },
    }
  },

  load(): ProjectConfigSpec {
    if (isFile(PROJECT_CONFIG_FILE)) {
      const data = fs.readFileSync(PROJECT_CONFIG_FILE, 'utf-8')
      return JSON.parse(data) as ProjectConfigSpec
    }

    logger.error(
      `Project config file does not exist or could not be found at ${PROJECT_CONFIG_FILE}.`,
    )
    logger.error('Did you run `dems setup`?')
    process.exit(1)
  },

  get(configFile = PROJECT_CONFIG_FILE): ProjectConfigSpec {
    this.check(PROJECT_CONFIG_FILE)
    return JSON.parse(fs.readFileSync(configFile).toString())
  },

  check(configFile = PROJECT_CONFIG_FILE) {
    if (isFile(configFile)) return
    logger.warn('Project config file does not exist or is not a valid file.')
    logger.warn("Run 'dems setup' to create it.")
    process.exit(1)
  },

  generate(config: ProjectConfigSpec) {
    createPath({ path: PROJECT_CONFIG_ROOT })
    createFile({
      file: `${config.projectRootPath}/config.json`,
      content: JSON.stringify(config),
    })
  },
}
