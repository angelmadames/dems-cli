import fs from 'node:fs';
import { confirm } from '@inquirer/prompts';
import log from './log';

export const sleep = (seconds: number): Promise<void> => {
  const time = seconds * 1000;
  return new Promise((r) => setTimeout(r, time));
};

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
    if (output) log.warning(`⏩ Path: ${target} already exists.`);
    return;
  }

  if (isFile(source)) {
    fs.copyFileSync(source, target, 0);
    if (output)
      log.success(`✅ File: ${source} successfully copied to ${target}.`);
  } else {
    if (output) log.error('❌ Source is not a valid file.');
    process.exit(1);
  }
};

export const createFile = (file: string, content: string): void => {
  if (!isFile(file)) {
    log.info(`Creating file: ${file}...`);
    fs.writeFileSync(file, content, 'utf8');
    log.success(`✅ File: ${file} successfully created.`);
  } else {
    log.warning(`File: ${file} already exists.`);
  }
};

export const createPath = (path: string): void => {
  if (!fs.existsSync(path)) {
    log.info(`Creating path: ${path}...`);
    fs.mkdirSync(path, { recursive: true });
    log.success(`✅ Path: ${path} successfully created.`);
  } else {
    log.warning(`Path: ${path} already exists.`);
  }
};

export const deletePath = async ({
  path,
  force = false,
}: {
  path: string;
  force?: boolean;
}): Promise<void> => {
  if (!isDirectory(path)) {
    log.warning(`⏩ Path: ${path} is not a valid directory. Not removing.`);
    return;
  }

  if (
    force ||
    (await confirm({ message: `Delete path ${path} recursively?` }))
  ) {
    fs.rmSync(path, { recursive: true, force: true });
    log.success(`🗑️ Path: ${path} recursively deleted.`);
  } else {
    log.info('⏩ Skipping...');
  }
};
