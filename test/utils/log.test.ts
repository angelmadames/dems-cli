import { beforeAll, describe, expect, test } from 'bun:test';
import log from '../../src/utils/log';
import { omitConsoleLogs } from '../helpers';

describe('Utils: log', () => {
  beforeAll(() => {
    omitConsoleLogs();
  });

  test('should log info message', () => {
    const info = log.info(['info'], 'optional');
    expect(info).toBeUndefined();
  });

  test('should log success message', () => {
    const success = log.success(['success'], 'optional');
    expect(success).toBeUndefined();
  });

  test('should log warning message', () => {
    const warning = log.warning(['warning'], 'optional');
    expect(warning).toBeUndefined();
  });

  test('should log dimmed warning message', () => {
    const dimmedWarning = log.dimmedWarning(['dimmed warning'], 'optional');
    expect(dimmedWarning).toBeUndefined();
  });

  test('should log error message', () => {
    const error = log.error(['error'], 'optional');
    expect(error).toBeUndefined();
  });
});
