import fs from 'node:fs';
import { confirm } from '@inquirer/prompts';
import type {
  FileModificationOperation,
  PathModificationOperation,
  SourceTargetOperation,
} from './interfaces';
import log from './log';

export const isFile = (path: string): boolean => {
  return fs.existsSync(path) && fs.lstatSync(path).isFile();
};

export const isDirectory = (path: string): boolean => {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
};

export const copyFile = ({
  source,
  target,
  verbose = true,
}: SourceTargetOperation) => {
  if (isFile(target)) {
    if (verbose) log.warning(`Path: ${target} already exists.`);
    return;
  }

  if (isFile(source)) {
    fs.copyFileSync(source, target, 0);
    if (verbose)
      log.success(`File: ${source} successfully copied to ${target}.`);
  } else {
    if (verbose) log.error('Source is not a valid file.');
    process.exit(1);
  }
};

export const createFile = ({
  file,
  content,
  verbose = true,
  override = false,
}: FileModificationOperation) => {
  if (!isFile(file) || override) {
    if (verbose) log.info(`Creating file: ${file}...`);
    fs.writeFileSync(file, content, 'utf8');
    if (verbose) log.success(`File: ${file} successfully created.`);
  } else {
    if (verbose) log.warning(`File: ${file} already exists.`);
  }
};

export const createPath = ({
  path,
  verbose = true,
}: PathModificationOperation) => {
  if (!fs.existsSync(path)) {
    if (verbose) log.info(`Creating path: ${path}...`);
    fs.mkdirSync(path, { recursive: true });
    if (verbose) log.success(`Path: ${path} successfully created.`);
  } else {
    if (verbose) log.warning(`Path: ${path} already exists.`);
  }
};

export const deletePath = async ({
  path,
  force = false,
  verbose = true,
}: PathModificationOperation) => {
  if (isDirectory(path)) {
    if (
      force ||
      (await confirm({ message: `Delete directory ${path} recursively?` }))
    ) {
      fs.rmdirSync(path, { recursive: true });
      if (verbose) log.success(`Directory ${path} deleted.`);
    }
  }

  if (isFile(path)) {
    if (
      force ||
      (await confirm({
        message: `Delete file ${path}?`,
      }))
    ) {
      fs.rmSync(path);
      if (verbose) log.success(`File ${path} deleted.`);
    }
  }

  return;
};
