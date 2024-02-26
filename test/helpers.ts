import { jest } from 'bun:test';
import log from '../src/utils/log';

export const omitConsoleLogs = () => {
  console.log = jest.fn();
  log.info = jest.fn();
  log.success = jest.fn();
  log.warning = jest.fn();
  log.error = jest.fn();
};
