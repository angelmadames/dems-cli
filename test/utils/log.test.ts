import { beforeEach, afterEach, describe, expect, test, jest, spyOn } from 'bun:test';
import log from '../../src/utils/log';
import chalk from 'chalk';

describe('log', () => {
  beforeEach(() => {
    spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should log info message in blue color', () => {
    log.info('info message');
    expect(console.log).toHaveBeenCalledWith(chalk.blue('info message'));
  });

  test('should log success message in green color', () => {
    log.success('success message');
    expect(console.log).toHaveBeenCalledWith(chalk.green('success message'));
  });

  test('should log warning message in yellow color', () => {
    log.warning('warning message');
    expect(console.log).toHaveBeenCalledWith(chalk.yellow('warning message'));
  });

  test('should log dimmed warning message in dim yellow color', () => {
    log.dimmedWarning('dimmed warning message');
    expect(console.log).toHaveBeenCalledWith(chalk.dim.yellow('dimmed warning message'));
  });

  test('should log error message in red color', () => {
    log.error('error message');
    expect(console.log).toHaveBeenCalledWith(chalk.red('error message'));
  });
});
