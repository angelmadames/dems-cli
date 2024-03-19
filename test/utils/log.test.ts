import { beforeEach, afterEach, describe, expect, test, jest, mock, spyOn } from 'bun:test';
import log from '../../src/utils/log';
import chalk from 'chalk';

mock.module('chalk', () => ({
  default: {
    blue: mock().mockReturnValue('blue-text'),
    green: mock().mockReturnValue('green-text'),
    yellow: mock().mockReturnValue('yellow-text'),
    dim: {
      yellow: mock().mockReturnValue('dim-yellow-text'),
    },
    red: mock().mockReturnValue('red-text'),
  }
}));

describe('log', () => {
  beforeEach(() => {
    spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should log info message in blue color', () => {
    log.info('info message');
    expect(chalk.blue).toHaveBeenCalledWith('info message');
    expect(console.log).toHaveBeenCalledWith('blue-text');
  });

  test('should log success message in green color', () => {
    log.success('success message');
    expect(chalk.green).toHaveBeenCalledWith('success message');
    expect(console.log).toHaveBeenCalledWith('green-text');
  });

  test('should log warning message in yellow color', () => {
    log.warning('warning message');
    expect(chalk.yellow).toHaveBeenCalledWith('warning message');
    expect(console.log).toHaveBeenCalledWith('yellow-text');
  });

  test('should log dimmed warning message in dim yellow color', () => {
    log.dimmedWarning('dimmed warning message');
    expect(chalk.dim.yellow).toHaveBeenCalledWith('dimmed warning message');
    expect(console.log).toHaveBeenCalledWith('dim-yellow-text');
  });

  test('should log error message in red color', () => {
    log.error('error message');
    expect(chalk.red).toHaveBeenCalledWith('error message');
    expect(console.log).toHaveBeenCalledWith('red-text');
  });
});
