export type DEMSProjectConfig = {
  compose: {
    project_name: string;
  };
  repositories: string[];
  paths: {
    repositories_root: string;
    data: string;
    env_file: string;
  };
  dockerfile: string;
  git: {
    org_url: string;
    default_ref: string;
  };
};

export const defaultConfig: DEMSProjectConfig = {
  compose: {
    project_name: '',
  },
  repositories: [],
  paths: {
    repositories_root: '',
    data: '',
    env_file: '',
  },
  dockerfile: '',
  git: {
    org_url: '',
    default_ref: '',
  },
};

export const demsEnvVars = {
  projectName: process.env.DEMS_CURRENT_PROJECT,
  repos: process.env.DEMS_PROJECT_REPOS,
  reposRoot: process.env.DEMS_PROJECT_REPOSITORIES_ROOT,
  gitDefaultRef: process.env.DEMS_GIT_DEFAULT_REF,
  gitOrgUrl: process.env.DEMS_GIT_ORG_URL,
  dockerfile: process.env.DEMS_DOCKERFILE,
  dataPath: process.env.DEMS_DATA_PATH,
  envFilePath: process.env.DEMS_PROJECT_ENV_FILE,
};
