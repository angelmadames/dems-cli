import * as fs from 'node:fs';
import { isFile } from './file-system.js';
import log from './log.js';

export const flattenObject = (
  // biome-ignore lint/suspicious/noExplicitAny:
  object: Record<string, any>,
  parentKey = '',
  separator = '_',
): Record<string, string | number> => {
  const result: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(object)) {
    const newKey = parentKey ? `${parentKey}${separator}${key}` : key;
    if (typeof value === 'object' && !Array.isArray(value)) {
      const flattened = flattenObject(value, newKey, separator);
      Object.assign(result, flattened);
    } else {
      result[newKey] = JSON.stringify(value);
    }
  }

  return result;
};

export const replaceKeyValue = (
  path: string,
  key: string,
  value: string,
): void => {
  if (!isFile(path)) {
    `❌ File ${path} is not a valid file.`;
  }
  try {
    const fileContent = fs.readFileSync(path, 'utf-8');
    const updatedContent = fileContent.replace(
      new RegExp(`${key}=.*`, 'g'),
      `${key}=${value}`,
    );
    fs.writeFileSync(path, updatedContent);
    log.success(`✅ File ${path} updated successfully with ${key}=${value}.`);
  } catch (error) {
    log.error(`❌ Error updating file ${path}. See below for more info:`);
    console.error(error);
  }
};

type mapLike<T = string> = { [key: string]: T };

export const replaceKeysInFile = (
  filePath: string,
  replaceMap: Map<string, string> | mapLike,
): void => {
  if (!isFile(filePath)) {
    `❌ File ${filePath} is not a valid file.`;
  }

  // biome-ignore lint/suspicious/noExplicitAny:
  const map: Map<string, any> =
    replaceMap instanceof Map
      ? replaceMap
      : new Map(Object.entries(replaceMap));

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let updatedContent = fileContent;
    for (const [key, value] of map) {
      updatedContent = fileContent.replace(
        new RegExp(`${key}=.*`, 'g'),
        `${key}=${value}`,
      );
    }
    fs.writeFileSync(filePath, updatedContent);
    log.success(`✅ File ${filePath} updated successfully with replacements.`);
  } catch (error) {
    log.error(`❌ Error updating file ${filePath}. See below for more info:`);
    console.error(error);
  }
};