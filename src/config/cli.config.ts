import fs from 'node:fs';
import { homedir } from 'node:os';
import { createFile, isFile } from '../utils/file-system';
import logger from '../utils/log';

export interface CLIConfigSpec {
  /**
   * The system path where all DEMS-related files will live.
   * It will be used to store config and data files.
   */
  rootPath: string;

  /**
   * The DEMS config file (config.json). Relative to DEMS root path.
   */
  configFile: string;

  /**
   * Active project file is read by DEMS to determine the current project.
   */
  activeProjectFile: string;

  /**
   * The application configuration needed by DEMS is expected to be inside each
   * application repository. The DEMS file path is the relative path of each
   * application repository where DEMS-files will be stored.
   */
  filesPath: string;

  /**
   * All docker compose commands run by DEMS will have the --env-file [path].
   * The env file will be appended to docker compose commands.
   */
  envFile: string;

  /**
   * The Dockerfile name that DEMS will try to use to provision the application
   * services. The path is relative to `rootPath`.
   */
  dockerfile: string;
}

class CLIConfig implements Partial<CLIConfigSpec> {
  rootPath = `${homedir()}/.dems`;
  configFile = `${this.rootPath}/config.json`;
  activeProjectFile = `${this.rootPath}/active-project`;
  filesPath = '.dems';
  envFile = '.env';
  dockerfile = `${this.filesPath}/Dockerfile`;

  default(): CLIConfigSpec {
    return {
      rootPath: this.rootPath,
      configFile: this.configFile,
      activeProjectFile: this.activeProjectFile,
      filesPath: this.filesPath,
      envFile: this.envFile,
      dockerfile: this.dockerfile,
    };
  }

  generate(config: CLIConfigSpec = this.default()) {
    createFile({
      file: `${config.rootPath}/config.json`,
      content: JSON.stringify(config, null, 2),
    });
  }

  get(configFile = this.configFile) {
    this.checkConfigFile();
    return fs.readFileSync(this.configFile);
  }

  activeProject() {
    this.checkActiveProjectFile();
    return fs.readFileSync(this.activeProjectFile).toString();
  }

  setActiveProject(project: string) {
    this.checkActiveProjectFile();
    fs.writeFileSync(this.activeProjectFile, project);
    logger.info(`Active project set to: '${project}'`);
  }

  private checkActiveProjectFile() {
    if (!isFile(this.activeProjectFile)) {
      logger.error(
        'Active project file does not exist or is not a valid file.',
      );
      process.exit(1);
    }
  }

  private checkConfigFile() {
    if (!isFile(this.configFile)) {
      logger.warn('DEMS config file does not exist or is not a valid file.');
      logger.warn("Run 'dems install' or 'dems config generate' to create it.");
      process.exit(1);
    }
  }
}

export default new CLIConfig();
