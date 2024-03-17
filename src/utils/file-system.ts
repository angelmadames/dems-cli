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
  target
}: SourceTargetOperation) => {
  if (isFile(target)) {
    log.warning(`Path: ${target} already exists.`);
    return;
  }

  if (isFile(source)) {
    fs.copyFileSync(source, target, 0);
    log.success(`File: ${source} copied to ${target}.`);
  } else {
    log.error('Source is not a valid file.');
    process.exit(1);
  }
};

export const createFile = ({
  file,
  content,
  override = false,
}: FileModificationOperation) => {
  if (!isFile(file) || override) {
    log.info(`Creating file: ${file}...`);
    fs.writeFileSync(file, content, 'utf8');
    log.success(`File: ${file} successfully created.`);
  } else {
    log.warning(`File: ${file} already exists.`);
  }
};

export const createPath = ({ path }: PathModificationOperation) => {
  if (!fs.existsSync(path)) {
   log.info(`Creating path: ${path}...`);
    fs.mkdirSync(path, { recursive: true });
   log.success(`Path: ${path} successfully created.`);
  } else {
   log.warning(`Path: ${path} already exists.`);
  }
};

export const deletePath = async ({
  path,
  force = false,
}: PathModificationOperation) => {
  if (isDirectory(path)) {
    if (
      force ||
      (await confirm({ message: `Delete directory ${path} recursively?` }))
    ) {
      fs.rmdirSync(path, { recursive: true });
      log.success(`Directory ${path} deleted.`);
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
      log.success(`File ${path} deleted.`);
    }
  }

  return;
};
