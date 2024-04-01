import { describe, expect, test } from 'bun:test';
import {
  capitalizeFirstLetter,
  hyphenToUnderscore,
  noIndent,
  removeBreakLines,
  removeExtraSpaces,
} from '../../src/utils/string';

describe('Utils: string', () => {
  describe('hyphenToUnderscore', () => {
    test('replaces hyphens with underscores', () => {
      expect(hyphenToUnderscore('hello-world')).toBe('hello_world');
    });

    test('handles multiple hyphens', () => {
      expect(hyphenToUnderscore('foo-bar-baz')).toBe('foo_bar_baz');
    });

    test('does not change words without hyphens', () => {
      expect(hyphenToUnderscore('hello')).toBe('hello');
    });
  });

  describe('capitalizeFirstLetter', () => {
    test('capitalizes the first letter of a word', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
    });

    test('does not change an already capitalized word', () => {
      expect(capitalizeFirstLetter('World')).toBe('World');
    });
  });

  describe('removeExtraSpaces', () => {
    test('removes extra spaces from the beginning and end', () => {
      expect(removeExtraSpaces('  hello   ')).toBe('hello');
    });

    test('replaces multiple spaces with a single space', () => {
      expect(removeExtraSpaces('hello    world')).toBe('hello world');
    });
  });

  describe('removeBreakLines', () => {
    test('removes break lines from text', () => {
      expect(removeBreakLines('hello\nworld')).toBe('helloworld');
    });

    test('handles different types of break lines', () => {
      expect(removeBreakLines('hello\r\nworld')).toBe('helloworld');
      expect(removeBreakLines('hello\rworld')).toBe('helloworld');
    });
  });

  describe('noIndent', () => {
    test('removes indentation from text', () => {
      const input = `
        hello
        world!
      `;
      const expectedOutput = 'hello\nworld!';
      expect(noIndent(input)).toBe(expectedOutput);
    });
  });
});
