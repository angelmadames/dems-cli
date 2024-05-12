export type DEMSProjectConfig = {
  compose: {
    project_name: string;
  };
  repositories: string[];
  paths: {
    repos: { [key: string]: string };
    repos_root: string;
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
    repos: {},
    repos_root: '',
    env_file: '',
  },
  dockerfile: '',
  git: {
    org_url: '',
    default_ref: '',
  },
};
