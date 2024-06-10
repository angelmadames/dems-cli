import fs from 'node:fs'
import { isFile } from './file-system'
import logger from './log'
import { toUpperSnakeCase } from './string'

export const flattenObject = (
  object: Record<string, any>,
  parentKey = '',
  separator = '_',
): Record<string, string | number> => {
  const result: Record<string, string | number> = {}

  for (const [key, value] of Object.entries(object)) {
    const newKey = parentKey
      ? `${parentKey}${separator}${key}`
      : key
    if (typeof value === 'object' && !Array.isArray(value)) {
      const flattened = flattenObject(value, newKey, separator)
      Object.assign(result, flattened)
    } else {
      result[newKey] = `${value}`
    }
  }

  return result
}

export const replaceKeyValue = (
  path: string,
  key: string,
  value: string,
): void => {
  if (!isFile(path)) {
    logger.error(`File ${path} is not a valid file.`)
    return
  }

  try {
    const fileContent = fs.readFileSync(path, 'utf-8')
    const updatedContent = fileContent.replace(
      new RegExp(`${key}=.*`, 'g'),
      `${key}=${value}`,
    )
    fs.writeFileSync(path, updatedContent)
    logger.info(`File ${path} updated successfully with ${key}=${value}.`)
  } catch (error) {
    logger.error(`Error updating file ${path}. See below for more info:`)
    throw new Error(`Error: ${error}`)
  }
}

type mapLike<T = string> = { [key: string]: T }

export const replaceKeysInFile = (
  filePath: string,
  replaceMap: Map<string, string> | mapLike,
): void => {
  if (!isFile(filePath)) {
    logger.error(`File ${filePath} is not a valid file.`)
    return
  }

  const map: Map<string, any> =
    replaceMap instanceof Map ? replaceMap : new Map(Object.entries(replaceMap))

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    let updatedContent = fileContent
    for (const [key, value] of map) {
      updatedContent = updatedContent.replace(
        new RegExp(`${key}=.*`, 'g'),
        `${key}=${value}`,
      )
    }
    fs.writeFileSync(filePath, updatedContent)
    logger.info(`File ${filePath} updated successfully with replacements.`)
  } catch (error) {
    logger.error(`Error updating file ${filePath}. See below for more info:`)
    throw new Error(`Error: ${error}`)
  }
}
