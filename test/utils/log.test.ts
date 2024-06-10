import { describe, expect, test } from 'bun:test'
import logger from '../../src/utils/log'

describe('log', () => {
  test('should log info message', () => {
    logger.info('info message')
    expect(logger.info).toHaveBeenCalledWith('info message')
  })

  test('should log warning message', () => {
    logger.warn('warning message')
    expect(logger.warn).toHaveBeenCalledWith('warning message')
  })

  test('should log error message', () => {
    logger.error('error message')
    expect(logger.error).toHaveBeenCalledWith('error message')
  })
})
