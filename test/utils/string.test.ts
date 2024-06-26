import { describe, expect, test } from 'bun:test'
import {
  capitalizeFirstLetter,
  hyphenToUnderscore,
  noIndent,
  removeBreakLines,
  removeExtraSpaces,
  toUpperSnakeCase,
} from '../../src/utils/string'

describe('Utils: string', () => {
  describe('hyphenToUnderscore', () => {
    test('replaces hyphens with underscores', () => {
      expect(hyphenToUnderscore('hello-world')).toBe('hello_world')
    })

    test('handles multiple hyphens', () => {
      expect(hyphenToUnderscore('foo-bar-baz')).toBe('foo_bar_baz')
    })

    test('does not change words without hyphens', () => {
      expect(hyphenToUnderscore('hello')).toBe('hello')
    })
  })

  describe('capitalizeFirstLetter', () => {
    test('capitalizes the first letter of a word', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello')
    })

    test('does not change an already capitalized word', () => {
      expect(capitalizeFirstLetter('World')).toBe('World')
    })
  })

  describe('removeExtraSpaces', () => {
    test('removes extra spaces from the beginning and end', () => {
      expect(removeExtraSpaces('  hello   ')).toBe('hello')
    })

    test('replaces multiple spaces with a single space', () => {
      expect(removeExtraSpaces('hello    world')).toBe('hello world')
    })
  })

  describe('removeBreakLines', () => {
    test('removes break lines from text', () => {
      expect(removeBreakLines('hello\nworld')).toBe('helloworld')
    })

    test('handles different types of break lines', () => {
      expect(removeBreakLines('hello\r\nworld')).toBe('helloworld')
      expect(removeBreakLines('hello\rworld')).toBe('helloworld')
    })
  })

  describe('noIndent', () => {
    test('removes indentation from text', () => {
      const input = `
        hello
        world!
      `
      const expectedOutput = 'hello\nworld!'
      expect(noIndent(input)).toBe(expectedOutput)
    })
  })

  describe('toUpperSnakeCase', () => {
    test('converts camelCase to UPPER_SNAKE_CASE', () => {
      const result = toUpperSnakeCase('camelCaseString')
      expect(result).toBe('CAMEL_CASE_STRING')
    })

    test('converts kebab-case to UPPER_SNAKE_CASE', () => {
      const result = toUpperSnakeCase('kebab-case-string')
      expect(result).toBe('KEBAB_CASE_STRING')
    })

    test('converts mixed camelCase and kebab-case to UPPER_SNAKE_CASE', () => {
      const result = toUpperSnakeCase('camelCase-kebab-case')
      expect(result).toBe('CAMEL_CASE_KEBAB_CASE')
    })

    test('converts single word to UPPER_SNAKE_CASE', () => {
      const result = toUpperSnakeCase('word')
      expect(result).toBe('WORD')
    })

    test('handles empty string input', () => {
      const result = toUpperSnakeCase('')
      expect(result).toBe('')
    })

    test('handles strings with underscores correctly', () => {
      const result = toUpperSnakeCase('already_snake_case')
      expect(result).toBe('ALREADY_SNAKE_CASE')
    })

    test('handles strings with multiple uppercase letters in sequence', () => {
      const result = toUpperSnakeCase('HTTPResponseCode')
      expect(result).toBe('HTTP_RESPONSE_CODE')
    })

    test('handles non-alphabetic characters correctly', () => {
      const result = toUpperSnakeCase('special@#Characters')
      expect(result).toBe('SPECIAL@#CHARACTERS')
    })
  })
})
