import { homedir } from 'node:os';
import { createFile } from '../utils/file-system';

export interface ProjectConfigSpec {
  /**
   * The project name determines how docker compose services will be prefixed,
   * thus maintaining complete isolation with other services deployed locally.
   * It also servers as a unique reference across DEMS tasks.
   */
  projectName: string;

  /**
   * The project root path is where DEMS will store project-scoped confguration
   * files. The project root path is by default relative to the DEMS CLI root
   * config path (~/.dems).
   */
  projectRootPath: string;

  /**
   * The Dockerfile name used by DEMS for the project. The location of the
   * Dockerfile is expected by DEMS in the application's repository DEMS
   * files directory.
   */
  dockerfile: string;

  /**
   * The repositories object is a refernce to the application repositories,
   * their names (key) and path (value). This is required for DEMS to be aware
   * of the desired state of applications to be managed.
   */
  repositories: { [key: string]: string };

  // The `git` object contains all configuration values for Git resources.
  git: {
    // The git organization where all repos referenced by DEMS are found.
    org: string;
    // The default git reference (branch, tag, commit) used to clone the repos.
    defaultRef: string;
  };
}

class ProjectConfig {
  default(): ProjectConfigSpec {
    return {
      projectName: 'demo',
      projectRootPath: `${homedir()}/.dems/demo`,
      dockerfile: 'Dockerfile',
      repositories: {
        'demo-api': `${homedir()}/repos/demo/demo-api`,
        'demo-webapp': `${homedir()}/repos/demo/demo-webapp`,
      },
      git: {
        org: 'gbh-tech',
        defaultRef: 'main',
      },
    };
  }

  generate(config: ProjectConfigSpec = this.default()) {
    createFile({
      file: `${config.projectRootPath}/config.json`,
      content: JSON.stringify(config),
    });
  }
}

export default new ProjectConfig();
