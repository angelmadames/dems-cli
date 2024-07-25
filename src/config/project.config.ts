import fs from 'node:fs'
import { join } from 'node:path'
import {
  createFile,
  createPath,
  deletePath,
  isDirectory,
  isFile,
} from '../utils/file-system'
import logger from '../utils/log'
import { CONFIG_PATH, DEMS_REPOS_PATH, cliConfig } from './cli.config'

const CURRENT_PROJECT = cliConfig.activeProject()
const PROJECT_CONFIG_ROOT = join(CONFIG_PATH, CURRENT_PROJECT)
const PROJECT_CONFIG_FILE = join(PROJECT_CONFIG_ROOT, 'config.json')
const PROJECT_ENV_FILE = join(PROJECT_CONFIG_ROOT, '.env')
const DEMS_FILES_PATH = '.ops'

// Single: A single repository containing a single application or service.
// MonoRepo: A single repository containing N applications.
// MultiRepo: Multiple repositories containing a single application or service.
export type ProjectTypes = 'Single' | 'MonoRepo' | 'MultiRepo'

export interface ProjectConfigSpec {
  // The project name determines how docker compose services will be prefixed,
  // thus maintaining compslete isolation with other services deployed locally.
  // It also servers as a unique reference across DEMS tasks.
  projectName: string

  // The project root path is where DEMS will store project-scoped confguration
  // files. The project root path is by default relative to the DEMS CLI root
  // config path (~/.dems).
  projectRootPath: string

  // The project config file (config.json). Relative to project root path.
  configFile: string

  // The application configuration needed by DEMS is expected to be inside each
  // application repository. The DEMS file path is the relative path of each
  // application repository where DEMS-files will be stored.
  filesPath: string

  // All docker compose commands run by DEMS will have the --env-file [path].
  // The env file will be appended to docker compose commands.
  envFile: string

  // The Dockerfile name used by DEMS for the project. The location of the
  // Dockerfile is expected by DEMS in the application's repository DEMS
  // files directory.
  dockerfile: string

  // The repositories object is a refernce to the application repositories,
  // their names (key) and path (value). This is required for DEMS to be aware
  // of the desired state of applications to be managed.
  repositories: { [key: string]: string }

  // Defines the project type that identifies the project. This will change the
  // behavior of DEMS commands and helper, so it's important that it's set to the
  // right type.
  projectType: ProjectTypes

  // Individual projects inside a MonoRepo project type. For example,
  // if a mono repo has two projects, backend & frontend, then, the
  // monoRepoServices will be like (relative to the path of the main repo):
  // monoRepoServices: {
  //   backend: "path/to/backend",
  //   frontend: "path/to/frontend"
  // }
  // 'projectType' must be set to 'MonoRepo' for this directive to work.
  monoRepoServices?: Array<string>

  // The `git` object contains all configuration values for Git resources.
  git: {
    // The git organization where all repos referenced by DEMS are found.
    org: string
    // The default git reference (branch, tag, commit) used to clone the repos.
    defaultRef: string
  }
}

export const projectConfig = {
  default(): ProjectConfigSpec {
    return {
      projectName: 'demo',
      projectRootPath: PROJECT_CONFIG_ROOT,
      configFile: PROJECT_CONFIG_FILE,
      filesPath: DEMS_FILES_PATH,
      projectType: 'Single',
      monoRepoServices: [""],
      dockerfile: 'dems.Dockerfile',
      envFile: PROJECT_ENV_FILE,
      repositories: {
        'demo-api': join(DEMS_REPOS_PATH, 'demo', 'demo-api'),
        'demo-webapp': join(DEMS_REPOS_PATH, 'demo', 'demo-web'),
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

  save(config: ProjectConfigSpec) {
    createPath({ path: config.projectRootPath })
    createFile({
      file: `${config.projectRootPath}/config.json`,
      content: JSON.stringify(config, null, 2),
      overwrite: true,
    })
  },

  remove(project: string) {
    const projectPath = join(CONFIG_PATH, project)
    if (isDirectory(projectPath)) {
      deletePath({ path: projectPath, force: true })
      logger.info(`Project '${project}' was successfully deleted.`)
      return
    }

    logger.warn(`Config path for '${project}' is not a valid directory.`)
    logger.warn(`Project '${project}' is most likely not initialized.`)
  },

  check(configFile = PROJECT_CONFIG_FILE) {
    if (isFile(configFile)) return
    logger.warn('Project config file does not exist or is not a valid file.')
    logger.warn("Run 'dems setup' to create it.")
    process.exit(1)
  },

  repoList() {
    return Object.keys(this.load().repositories)
  },

  repoURLs() {
    return Object.values(this.load().repositories)
  },

  reposPaths() {
    const paths = []
    const { repositories, projectType } = this.load()
    const { reposPath } = cliConfig.load()

    if (projectType === 'MonoRepo') {
      const { monoRepoServices } = this.load()
      if (monoRepoServices) {
        for (const service of monoRepoServices) {
          paths.push(join(reposPath, Object.keys(repositories)[0], service))
        }
      }
    } else {
      for (const repo in repositories) {
        paths.push(join(reposPath, repo))
      }
    }

    return paths
  },

  repoServicesList() {
    const { projectType, monoRepoServices } = this.load()
    if (projectType === 'MonoRepo') {
      return monoRepoServices
    }

    logger.error('Curent project is not a mono repository.')
    process.exit(1)
  },
}
