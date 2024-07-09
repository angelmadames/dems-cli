import fs from 'node:fs'
import path from 'node:path'
import { confirm } from '@inquirer/prompts'
import type {
  FileModificationOperation,
  PathModificationOperation,
  SourceTargetOperation,
} from './interfaces'
import logger from './log'

export async function isFile(path: string) {
  return fs.existsSync(path) && fs.lstatSync(path).isFile()
}

export async function isDirectory(path: string) {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory()
}

export async function copyFile({ source, target }: SourceTargetOperation) {
  if (await isFile(target)) {
    logger.warn(`Path: ${target} already exists.`)
    return
  }

  if (await isFile(source)) {
    fs.copyFileSync(source, target, 0)
    logger.info(`File: ${source} copied to ${target}.`)
  } else {
    logger.error('Could not perform file copy operation.')
    logger.error('Source is not a valid file.')
  }
}

export function createFile({
  file,
  content,
  overwrite = false,
}: FileModificationOperation) {
  if (!isFile(file) || overwrite) {
    logger.info(`Creating file: ${file}...`)
    fs.writeFileSync(file, content, 'utf8')
    logger.info(`File: '${file}' successfully created.`)
  } else {
    logger.warn(`File: '${file}' already exists.`)
  }
}

export function createPath({ path }: PathModificationOperation) {
  if (!isDirectory(path)) {
    logger.info(`Creating path: ${path}...`)
    fs.mkdirSync(path, { recursive: true })
    logger.info(`Path: '${path}' successfully created.`)
  } else {
    logger.warn(`Path: '${path}' already exists.`)
  }
}

export async function deletePath({
  path,
  force = false,
}: PathModificationOperation) {
  if (await isDirectory(path)) {
    if (
      force ||
      (await confirm({ message: `Delete directory ${path} recursively?` }))
    ) {
      fs.rmdirSync(path, { recursive: true })
      logger.info(`Directory ${path} deleted.`)
    }
  }

  if (await isFile(path)) {
    if (
      force ||
      (await confirm({
        message: `Delete file ${path}?`,
      }))
    ) {
      fs.rmSync(path)
      logger.info(`File ${path} deleted.`)
    }
  }

  return
}

export function readPathMatchingFiles(
  dir: string,
  matchFileName: string,
): Array<string> {
  const results: Array<string> = [];

  function recursiveReadDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(entry.parentPath, entry.name)

      if (entry.isDirectory()) {
        recursiveReadDir(fullPath)
      }

      if (entry.isFile() && entry.name.includes(matchFileName)) {
        results.push(fullPath)
      }
    }
  }

  recursiveReadDir(dir)
  return results
}
