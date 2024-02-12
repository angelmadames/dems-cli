import { describe, expect, test } from 'bun:test';
import {
  capitalizeFirstLetter,
  removeBreakLines,
  removeExtraSpaces,
} from '../src/utils/string';

describe('Utils: string', () => {
  test('first letter of a word is capitalized', () => {
    const lowerWord = 'lowercase';
    const capWord = capitalizeFirstLetter(lowerWord);
    expect(capWord).toBeString();
    expect(capWord).toEqual('Lowercase');
  });

  test('extra spaces are removed from a string', () => {
    const sentence = '  this    is   a    test   ';
    const noSpaceSentence = removeExtraSpaces(sentence);
    expect(noSpaceSentence).toBeString();
    expect(noSpaceSentence).toEqual('this is a test');
  });

  test('all break lines are removed from string', () => {
    const sentence = '\nthis \nis \na \nanother \ntest\n';
    const noSpaceSentence = removeBreakLines(sentence);
    expect(noSpaceSentence).toBeString();
    expect(noSpaceSentence).toEqual('this is a another test');
  });
});
