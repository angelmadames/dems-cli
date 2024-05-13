import fs from 'node:fs';
import { confirm } from '@inquirer/prompts';
import type {
  FileModificationOperation,
  PathModificationOperation,
  SourceTargetOperation,
} from './interfaces';
import logger from './log';

export const isFile = (path: string) => {
  return fs.existsSync(path) && fs.lstatSync(path).isFile();
};

export const isDirectory = (path: string) => {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
};

export const copyFile = ({ source, target }: SourceTargetOperation) => {
  if (isFile(target)) {
    logger.warn(`Path: ${target} already exists.`);
    return;
  }

  if (isFile(source)) {
    fs.copyFileSync(source, target, 0);
    logger.info(`File: ${source} copied to ${target}.`);
  } else {
    logger.error('Source is not a valid file.');
    throw new Error('Could not perform file copy operation.');
  }
};

export const createFile = ({
  file,
  content,
  override = false,
}: FileModificationOperation) => {
  if (!isFile(file) || override) {
    logger.info(`Creating file: ${file}...`);
    fs.writeFileSync(file, content, 'utf8');
    logger.info(`File: ${file} successfully created.`);
  } else {
    logger.warn(`File: ${file} already exists.`);
  }
};

export const createPath = ({ path }: PathModificationOperation) => {
  if (!isDirectory(path)) {
    logger.info(`Creating path: ${path}...`);
    fs.mkdirSync(path, { recursive: true });
    logger.info(`Path: ${path} successfully created.`);
  } else {
    logger.warn(`Path: ${path} already exists.`);
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
      logger.info(`Directory ${path} deleted.`);
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
      logger.info(`File ${path} deleted.`);
    }
  }

  return;
};
