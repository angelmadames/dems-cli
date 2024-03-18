import { describe, expect, mock, test, jest, beforeEach } from 'bun:test';
import log from '../../src/utils/log';

mock.module('../../src/utils/log', () => ({
  default: {
    info: mock(),
    warning: mock(),
    dimmedWarning: mock(),
    success: mock(),
    error: mock(),
  },
}));

describe('Utils: log', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should log info message in blue color', () => {
    log.info('info message');
    expect(log.info).toHaveBeenCalledWith('info message');
  });

  test('should log success message in green color', () => {
    log.success('success message');
    expect(log.success).toHaveBeenCalledWith('success message');
  });

  test('should log warning message in yellow color', () => {
    log.warning('warning message');
    expect(log.warning).toHaveBeenCalledWith('warning message');
  });

  test('should log dimmed warning message in dim yellow color', () => {
    log.dimmedWarning('dimmed warning message');
    expect(log.dimmedWarning).toHaveBeenCalledWith('dimmed warning message');
  });

  test('should log error message in red color', () => {
    log.error('error message');
    expect(log.error).toHaveBeenCalledWith('error message');
  });
});
