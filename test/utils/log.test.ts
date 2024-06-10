import { describe, expect, test } from 'bun:test'
import logger, { formatLog } from '../../src/utils/log'

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

  test('should trim leading and trailing whitespace', () => {
    const result = formatLog('  Hello World  ');
    expect(result).toBe('Hello World');
  });

  test('should replace multiple spaces with a single space', () => {
    const result = formatLog('Hello   World');
    expect(result).toBe('Hello World');
  });

  test('should handle strings with only whitespace', () => {
    const result = formatLog('     ');
    expect(result).toBe('');
  });

  test('should handle empty strings', () => {
    const result = formatLog('');
    expect(result).toBe('');
  });

  test('should handle strings with mixed whitespace characters', () => {
    const result = formatLog('Hello \t World \n');
    expect(result).toBe('Hello World');
  });

  test('should not change a properly formatted string', () => {
    const result = formatLog('Hello World');
    expect(result).toBe('Hello World');
  });
})
