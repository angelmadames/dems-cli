import fs from 'node:fs';
import { confirm } from '@inquirer/prompts';
import log from './log';

export const isFile = (path: string): boolean => {
  return fs.existsSync(path) && fs.lstatSync(path).isFile();
};

export const isDirectory = (path: string): boolean => {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
};

export const copyFile = (
  source: string,
  target: string,
  output = true,
): void => {
  if (isFile(target)) {
    if (output) log.warning(`Path: ${target} already exists.`);
    return;
  }

  if (isFile(source)) {
    fs.copyFileSync(source, target, 0);
    if (output)
      log.success(`File: ${source} successfully copied to ${target}.`);
  } else {
    if (output) log.error('Source is not a valid file.');
    process.exit(1);
  }
};

interface FileModificiationInput {
  file: string;
  content: string;
  verbose?: boolean;
  override?: boolean;
}

export const createFile = ({
  file,
  content,
  verbose = true,
  override = false,
}: FileModificiationInput): void => {
  if (!isFile(file) || override) {
    if (verbose) log.info(`Creating file: ${file}...`);
    fs.writeFileSync(file, content, 'utf8');
    if (verbose) log.success(`File: ${file} successfully created.`);
  } else {
    if (verbose) log.warning(`File: ${file} already exists.`);
  }
};

export const createPath = (path: string, verbose = true): void => {
  if (!fs.existsSync(path)) {
    if (verbose) log.info(`Creating path: ${path}...`);
    fs.mkdirSync(path, { recursive: true });
    if (verbose) log.success(`Path: ${path} successfully created.`);
  } else {
    if (verbose) log.warning(`Path: ${path} already exists.`);
  }
};

interface PathDeletionParams {
  path: string;
  force?: boolean;
  verbose?: boolean;
}

export const deletePath = async ({
  path,
  force = false,
  verbose = true,
}: PathDeletionParams) => {
  if (isDirectory(path)) {
    if (
      force ||
      (await confirm({ message: `Delete directory ${path} recursively?` }))
    ) {
      fs.rmdirSync(path, { recursive: true });
      if (verbose) log.success(`Directory ${path} deleted.`);
      return;
    }
  }

  if (isFile(path)) {
    if (
      force ||
      (await confirm({
        message: `Delete file ${path}?`,
      }))
    ) {
      fs.rmSync(path, { force: true });
      if (verbose) log.success(`File ${path} deleted.`);
      return;
    }
  }
};
