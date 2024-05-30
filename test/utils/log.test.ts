import { describe, expect, test } from 'bun:test'
import chalk from 'chalk'
import log from '../../src/utils/log'

describe('log', () => {
  test('should log info message in blue color', () => {
    logger.info('info message')
    expect(console.log).toHaveBeenCalledWith(chalk.blue('info message'))
  })

  test('should log success message in green color', () => {
    logger.info('success message')
    expect(console.log).toHaveBeenCalledWith(chalk.green('success message'))
  })

  test('should log warning message in yellow color', () => {
    logger.warn('warning message')
    expect(console.log).toHaveBeenCalledWith(chalk.yellow('warning message'))
  })

  test('should log dimmed warning message in dim yellow color', () => {
    log.dimmedWarning('dimmed warning message')
    expect(console.log).toHaveBeenCalledWith(
      chalk.dim.yellow('dimmed warning message'),
    )
  })

  test('should log error message in red color', () => {
    logger.error('error message')
    expect(console.log).toHaveBeenCalledWith(chalk.red('error message'))
  })
})
