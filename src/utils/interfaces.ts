export interface SourceTargetOperation {
  source: string;
  target: string;
}

export interface FileModificationOperation {
  file: string;
  content: string;
  override?: boolean;
}

export interface PathModificationOperation {
  path: string;
  force?: boolean;
}

export interface ComposeFilesParams {
  prefix?: string;
  filesDir?: string;
  reposRoot?: string;
  repos?: string[];
}

export interface ComposeExecParams {
  envFiles?: Array<string>;
  files?: Array<string>;
  cmd: Array<string>;
}

export interface GitParams {
  repo: string;
  path: string;
  ref: string;
}
